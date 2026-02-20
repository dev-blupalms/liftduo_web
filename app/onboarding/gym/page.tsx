'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { SelectableButton } from '@/components/onboarding/SelectableButton';

export default function OnboardingGymPage() {
    const router = useRouter();
    const [ownGym, setOwnGym] = useState<boolean | null>(null);

    const handleNext = () => {
        if (ownGym === null) return;
        console.log('Own gym:', ownGym);
        // console.log('Own gym:', ownGym);
        router.push('/onboarding/speciality');
    };

    const handleBack = () => {
        router.push('/onboarding/location');
    };

    return (
        <div className="flex flex-col items-center w-full">
            <OnboardingCard>
                <div className="text-center mb-12 w-full max-w-[662px] mx-auto">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                        Own gym?
                    </h3>
                    <p className="text-gray-500">
                        Do you own a gym or have access where your trainees can train
                    </p>
                </div>

                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[400px] flex flex-col gap-[12px]">
                        <SelectableButton
                            label="Yes"
                            selected={ownGym === true}
                            onClick={() => setOwnGym(true)}
                            className="w-full h-[50px] rounded-[12px] text-sm"
                        />
                        <SelectableButton
                            label="No"
                            selected={ownGym === false}
                            onClick={() => setOwnGym(false)}
                            className="w-full h-[50px] rounded-[12px] text-sm"
                        />
                    </div>
                </div>
            </OnboardingCard>

            <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-end gap-[15px] sm:gap-[10px] mt-[40px]">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="w-full sm:w-[150px] h-[52px] rounded-full text-base font-bold bg-white text-black border !border-black hover:bg-gray-50"
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    className="bg-black hover:bg-gray-800 text-white w-full sm:w-[250px] h-[52px] rounded-full text-base font-bold"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
