import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAccessToken, generateRefreshToken, hashToken, REFRESH_TOKEN_EXPIRY_MS } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { refreshToken } = await request.json();

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, message: 'Missing refresh token' },
                { status: 400 }
            );
        }

        const tokenHash = hashToken(refreshToken);

        const tokenRecord = await prisma.refreshToken.findFirst({
            where: { tokenHash },
            include: { user: true },
        });

        if (!tokenRecord) {
            return NextResponse.json(
                { success: false, message: 'Invalid refresh token' },
                { status: 401 }
            );
        }

        if (tokenRecord.revoked || new Date() > tokenRecord.expiresAt) {
            // Security: Revoke all tokens for this user if a reused/compromised token is detected?
            // For now, just revoke this one (if not already revoked) and deny.
            if (!tokenRecord.revoked) {
                await prisma.refreshToken.update({
                    where: { id: tokenRecord.id },
                    data: { revoked: true },
                });
            }
            return NextResponse.json(
                { success: false, message: 'Token revoked or expired' },
                { status: 401 }
            );
        }

        // Determine Role (could be fetched from user relation)
        const role = tokenRecord.user.role;

        // Rotate Token
        const newAccessToken = await generateAccessToken({ userId: tokenRecord.user.id, role });
        const newRefreshToken = generateRefreshToken();
        const newRefreshTokenHash = hashToken(newRefreshToken);

        // Revoke old token and create new one
        // Ideally in transaction
        await prisma.$transaction([
            prisma.refreshToken.update({
                where: { id: tokenRecord.id },
                data: { revoked: true },
            }),
            prisma.refreshToken.create({
                data: {
                    userId: tokenRecord.user.id,
                    tokenHash: newRefreshTokenHash,
                    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            }
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
