import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function POST(request: Request) {
    try {
        // 1. Verify Auth
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }
        const token = authHeader.split(' ')[1];
        const payload = await verifyAccessToken(token);

        if (!payload || payload.role !== Role.CLIENT) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized or invalid role' },
                { status: 403 }
            );
        }

        const { userId } = payload;
        const body = await request.json();
        const {
            gender,
            heightCm,
            weightKg,
            workoutFrequency,
            fitnessGoal,
            profileImage
        } = body;

        // 2. Update Profile
        await prisma.clientProfile.upsert({
            where: { userId },
            update: {
                gender,
                heightCm: heightCm ? (isNaN(parseFloat(heightCm)) ? undefined : parseFloat(heightCm)) : undefined,
                weightKg: weightKg ? (isNaN(parseFloat(weightKg)) ? undefined : parseFloat(weightKg)) : undefined,
                workoutFrequency,
                fitnessGoal,
                profileImage,
            },
            create: {
                userId,
                gender,
                heightCm: heightCm ? parseFloat(heightCm) : undefined,
                weightKg: weightKg ? parseFloat(weightKg) : undefined,
                workoutFrequency,
                fitnessGoal,
                profileImage,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Client profile updated successfully'
        });

    } catch (error) {
        console.error('Client onboarding error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
