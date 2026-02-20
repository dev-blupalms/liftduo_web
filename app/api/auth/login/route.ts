import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateAccessToken, generateRefreshToken, hashToken, REFRESH_TOKEN_EXPIRY_MS } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, phone, password } = body;

        let user = null;

        if (email) {
            user = await prisma.user.findUnique({ where: { email } });
        } else if (phone) {
            user = await prisma.user.findUnique({ where: { phone } });
        }

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Verify Password (if user has one)
        if (user.passwordHash) {
            if (!password) {
                return NextResponse.json(
                    { success: false, message: 'Password required' },
                    { status: 400 }
                );
            }
            const isValid = await verifyPassword(password, user.passwordHash);
            if (!isValid) {
                return NextResponse.json(
                    { success: false, message: 'Invalid credentials' },
                    { status: 401 }
                );
            }
        } else {
            // If user has no password (maybe purely OTP based in future?), fail for now as we don't have OTP impl
            // Or if it's a client without password, we might need OTP flow here.
            // For this task, we assume password or we mock OTP.
            // Let's assume for now Clients also set a password during signup or we just fail.
            return NextResponse.json(
                { success: false, message: 'Authentication method not supported yet (no password set)' },
                { status: 401 }
            );
        }

        // Login successful - Generate Tokens
        const accessToken = await generateAccessToken({ userId: user.id, role: user.role });
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = hashToken(refreshToken);

        // Save Refresh Token
        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: refreshTokenHash,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
