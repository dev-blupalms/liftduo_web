import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/auth';

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

        // Find and revoke
        // We updateMany in case multiple entries somehow exist (though unlikely with unique constraint if we had one on hash, but we don't strictly enforce unique hash in schema, just id)
        // Actually schema has NO unique on tokenHash, just id. So findFirst is safer.

        // Better: findFirst then update. Or updateMany where tokenHash matches.
        const result = await prisma.refreshToken.updateMany({
            where: { tokenHash },
            data: { revoked: true },
        });

        if (result.count === 0) {
            // Token not found or already handled? we can just say success to not leak info or 404.
            // Let's return success.
        }

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
