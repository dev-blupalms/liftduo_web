import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateAccessToken, generateRefreshToken, hashToken, REFRESH_TOKEN_EXPIRY_MS } from '@/lib/auth';
import { Role, Prisma } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, phone, password, name, role } = body;

        // Validate Role
        if (!Object.values(Role).includes(role)) {
            return NextResponse.json(
                { success: false, message: 'Invalid role' },
                { status: 400 }
            );
        }

        // Role-specific validation
        if (role === Role.TRAINER) {
            if (!email || !password) {
                return NextResponse.json(
                    { success: false, message: 'Email and password are required for trainers' },
                    { status: 400 }
                );
            }
        } else if (role === Role.CLIENT) {
            if (!phone && !email) {
                return NextResponse.json(
                    { success: false, message: 'Phone number or Email is required for clients' },
                    { status: 400 }
                );
            }
        }

        // Check if user exists
        if (email) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return NextResponse.json(
                    { success: false, message: 'User with this email already exists' },
                    { status: 409 }
                );
            }
        }
        if (phone) {
            const existingUser = await prisma.user.findUnique({ where: { phone } });
            if (existingUser) {
                return NextResponse.json(
                    { success: false, message: 'User with this phone number already exists' },
                    { status: 409 }
                );
            }
        }

        // Hash password if provided
        let passwordHash = null;
        if (password) {
            passwordHash = await hashPassword(password);
        }

        // Create User and Profile within a transaction
        const newUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    email: email || null,
                    phone: phone || null,
                    passwordHash,
                    name,
                    role,
                },
            });

            // 2. Create Profile based on role
            if (role === Role.TRAINER) {
                await tx.trainerProfile.create({
                    data: {
                        userId: user.id,
                        // Initialize with empty/default values where allowed by schema
                    },
                });
            } else if (role === Role.CLIENT) {
                await tx.clientProfile.create({
                    data: {
                        userId: user.id,
                        // Initialize with empty/default values
                    },
                });
            }

            return user;
        });

        // Generate Tokens
        const accessToken = await generateAccessToken({ userId: newUser.id, role: newUser.role });
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = hashToken(refreshToken);

        // Save Refresh Token
        await prisma.refreshToken.create({
            data: {
                userId: newUser.id,
                tokenHash: refreshTokenHash,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
            },
        });

        // Return response
        return NextResponse.json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    role: newUser.role,
                },
                accessToken,
                refreshToken,
            }
        }, { status: 201 });

    } catch (error) {
        // Handle unique constraint violation (concurrent signup)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            const target = (error.meta?.target as string[]) || [];
            if (target.includes('email')) {
                return NextResponse.json(
                    { success: false, message: 'User with this email already exists' },
                    { status: 409 }
                );
            }
            if (target.includes('phone')) {
                return NextResponse.json(
                    { success: false, message: 'User with this phone number already exists' },
                    { status: 409 }
                );
            }
        }
        console.error('Signup error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
