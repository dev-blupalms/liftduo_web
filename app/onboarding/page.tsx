'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useTrainerOnboarding } from '@/hooks/useOnboarding';
import { BioStep } from '@/components/onboarding/steps/BioStep';
import { LocationStep } from '@/components/onboarding/steps/LocationStep';
import { GymStep } from '@/components/onboarding/steps/GymStep';
import { SpecialityStep } from '@/components/onboarding/steps/SpecialityStep';
import { ServicesStep } from '@/components/onboarding/steps/ServicesStep';
import { PhotoStep } from '@/components/onboarding/steps/PhotoStep';
import { VerificationStep } from '@/components/onboarding/steps/VerificationStep';

export default function OnboardingPage() {
    const { data: user, isLoading } = useUser();
    const onboarding = useTrainerOnboarding();
    const [localActiveStep, setLocalActiveStep] = useState<number | null>(null);

    const activeStep = localActiveStep !== null ? localActiveStep : (user?.onboardingStep || 1);

    const handleNext = (data: { step: number;[key: string]: unknown }) => {
        onboarding.mutate(data, {
            onSuccess: () => {
                setLocalActiveStep(activeStep + 1);
            }
        });
    };

    const handleBack = () => {
        if (activeStep > 1) {
            setLocalActiveStep(activeStep - 1);
        }
    };

    if (isLoading || !user) {
        return (
            <div className="w-full flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    const renderStep = () => {
        const trainerProfile = user?.trainerProfile;

        switch (activeStep) {
            case 1:
                return (
                    <BioStep
                        data={trainerProfile}
                        onNext={handleNext}
                        isPending={onboarding.isPending}
                        error={onboarding.error}
                    />
                );
            case 2:
                return (
                    <LocationStep
                        data={trainerProfile}
                        onNext={handleNext}
                        onBack={handleBack}
                        isPending={onboarding.isPending}
                        error={onboarding.error}
                    />
                );
            case 3:
                return (
                    <GymStep
                        data={trainerProfile}
                        onNext={handleNext}
                        onBack={handleBack}
                        isPending={onboarding.isPending}
                        error={onboarding.error}
                    />
                );
            case 4:
                return (
                    <SpecialityStep
                        data={trainerProfile}
                        onNext={handleNext}
                        onBack={handleBack}
                        isPending={onboarding.isPending}
                        error={onboarding.error}
                    />
                );
            case 5:
                return (
                    <ServicesStep
                        data={trainerProfile}
                        onNext={handleNext}
                        onBack={handleBack}
                        isPending={onboarding.isPending}
                        error={onboarding.error}
                    />
                );
            case 6:
                return (
                    <PhotoStep
                        data={trainerProfile}
                        onNext={handleNext}
                        onBack={handleBack}
                        isPending={onboarding.isPending}
                        error={onboarding.error}
                    />
                );
            case 7:
                return <VerificationStep />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center w-full flex-1">
            {activeStep < 6 && (
                <>
                    <h2 className="text-4xl font-black text-gray-900 mb-8 text-center tracking-tight">
                        Let&apos;s get you started
                    </h2>

                    {/* Progress Bar */}
                    <div className="flex space-x-3 mb-12">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${step <= activeStep ? 'bg-black' : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
            {renderStep()}
        </div>
    );
}
