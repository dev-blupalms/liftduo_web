import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';
import { Role, LocationType } from '@prisma/client';

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

        if (!payload || payload.role !== Role.TRAINER) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized or invalid role' },
                { status: 403 }
            );
        }

        const { userId } = payload;
        const body = await request.json();
        const { step, bio, location, country, state, city, zip, hasGym, specialties, services, photoUrl } = body;

        if (!step) {
            return NextResponse.json(
                { success: false, message: 'Step is required' },
                { status: 400 }
            );
        }

        // 2. Fetch current profile to calculate next step
        const currentProfile = await prisma.trainerProfile.findUnique({ where: { userId } });
        const currentOnboardingStep = currentProfile?.onboardingStep || 1;

        // 3. Update Profile & Relations based on Step
        await prisma.$transaction(async (tx) => {
            if (step === 1) {
                // Step 1: Bio
                await tx.trainerProfile.update({
                    where: { userId },
                    data: {
                        bio,
                        onboardingStep: Math.max(currentOnboardingStep, 2)
                    },
                });
            } else if (step === 2) {
                // Step 2: Location
                await tx.trainerProfile.update({
                    where: { userId },
                    data: {
                        location,
                        country,
                        state,
                        city,
                        zip,
                        onboardingStep: Math.max(currentOnboardingStep, 3)
                    },
                });
            } else if (step === 3) {
                // Step 3: Gym
                await tx.trainerProfile.update({
                    where: { userId },
                    data: { hasGym, onboardingStep: Math.max(currentOnboardingStep, 4) },
                });
            } else if (step === 4) {
                // Step 4: Speciality
                let specialtyIdsString = null;
                if (specialties && Array.isArray(specialties)) {
                    const specialtyIds = [];
                    for (const name of specialties) {
                        const slug = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]/g, '');
                        const s = await tx.specialty.upsert({
                            where: { slug },
                            update: { name },
                            create: { name, slug }
                        });
                        specialtyIds.push(s.id);
                    }
                    specialtyIdsString = specialtyIds.join(', ');
                }
                await tx.trainerProfile.update({
                    where: { userId },
                    data: {
                        specialtyIds: specialtyIdsString,
                        onboardingStep: Math.max(currentOnboardingStep, 5)
                    },
                });
            } else if (step === 5) {
                // Step 5: Service
                if (services && Array.isArray(services)) {
                    const trainer = currentProfile;
                    if (trainer) {
                        await tx.trainerService.deleteMany({ where: { trainerId: trainer.id } });
                        const validLocationTypes = Object.values(LocationType);
                        const mappedServices = services.map((s: Record<string, unknown>) => {
                            const durationMinutes = parseInt(String(s.durationMinutes), 10);
                            const price = parseFloat(String(s.price));
                            const locationType = s.locationType as string;

                            if (isNaN(durationMinutes) || isNaN(price)) {
                                throw new Error('Invalid duration or price value');
                            }
                            if (durationMinutes <= 0 || price < 0) {
                                throw new Error('Duration must be positive and price must be non-negative');
                            }
                            if (!validLocationTypes.includes(locationType as LocationType)) {
                                throw new Error('Invalid location type');
                            }

                            return {
                                trainerId: trainer.id,
                                title: String(s.title || ''),
                                durationMinutes,
                                price,
                                description: String(s.description || ''),
                                locationType: locationType as LocationType,
                            };
                        });
                        await tx.trainerService.createMany({
                            data: mappedServices,
                        });
                        await tx.trainerProfile.update({
                            where: { id: trainer.id },
                            data: { onboardingStep: Math.max(currentOnboardingStep, 6) },
                        });
                    }
                }
            } else if (step === 6) {
                // Step 6: Profile (Photo)
                await tx.trainerProfile.update({
                    where: { userId },
                    data: {
                        profileImage: photoUrl,
                        onboardingStep: Math.max(currentOnboardingStep, 7)
                    }, // 7 means complete
                });
            }
        });

        return NextResponse.json({
            success: true,
            message: `Step ${step} completed successfully`,
            nextStep: step + 1
        });

    } catch (error) {
        console.error('Trainer onboarding error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
