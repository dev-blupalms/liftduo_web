'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { SelectableButton } from '@/components/onboarding/SelectableButton';
import { SPECIALITIES } from './specialities';

export default function OnboardingSpecialityPage() {
    const router = useRouter();
    const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);

    const toggleSpeciality = (speciality: string) => {
        setSelectedSpecialities((prev) =>
            prev.includes(speciality)
                ? prev.filter((s) => s !== speciality)
                : [...prev, speciality]
        );
    };

    const handleNext = () => {
        if (selectedSpecialities.length === 0) return;
        console.log('Selected specialities:', selectedSpecialities);
        router.push('/onboarding/services');
    };

    const handleBack = () => {
        router.push('/onboarding/gym');
    };

    return (
        <div className="flex flex-col items-center w-full font-roboto">
            <OnboardingCard>
                <div className="text-center mb-8 w-full max-w-[662px] mx-auto">
                    <h3 className="text-[24px] font-black text-gray-900 mb-2">
                        Your speciality
                    </h3>
                    <p className="text-[18px] text-[#666666]">
                        Please select the items you are an expert of
                    </p>
                </div>

                <div className="w-full flex justify-center">
                    <div className="flex flex-wrap justify-center gap-[8px]">
                        {SPECIALITIES.map((speciality) => {
                            const isSelected = selectedSpecialities.includes(speciality);
                            return (
                                <SelectableButton
                                    key={speciality}
                                    label={speciality}
                                    selected={isSelected}
                                    onClick={() => toggleSpeciality(speciality)}
                                    className="px-[20px] py-[12px] rounded-[4px] text-[15px] font-normal leading-none"
                                />
                            );
                        })}
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
