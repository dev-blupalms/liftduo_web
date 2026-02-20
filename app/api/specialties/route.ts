import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const specialties = await prisma.specialty.findMany({
            // orderBy: { name: 'asc' }
        });
        return NextResponse.json({
            success: true,
            data: specialties
        });
    } catch (error) {
        console.error('Fetch specialties error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
