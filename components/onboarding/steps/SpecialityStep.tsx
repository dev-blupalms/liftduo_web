'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { SelectableButton } from '@/components/onboarding/SelectableButton';

const FALLBACK_SPECIALITIES = [
    'General Fitness',
    'Bodybuilding',
    'Powerlifting',
    'Yoga',
    'Pilates',
    'CrossFit',
    'Strength & Conditioning',
    'Weight Loss',
    'Senior Fitness',
    'Pre/Postnatal Fitness'
];

interface SpecialityStepProps {
    data?: Record<string, unknown>;
    onNext: (data: { step: number; specialties: string[] }) => void;
    onBack: () => void;
    isPending: boolean;
    error: Error | null;
}

export function SpecialityStep({ data, onNext, onBack, isPending, error }: SpecialityStepProps) {
    const [specialties, setSpecialties] = useState<{ id: string, name: string }[]>(
        FALLBACK_SPECIALITIES.map(name => ({ id: name, name }))
    );
    const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
    const [isPrepopulated, setIsPrepopulated] = useState(false);

    useEffect(() => {
        async function fetchSpecialties() {
            try {
                const response = await fetch('/api/specialties');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();

                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    setSpecialties(data.data);
                }
            } catch (error) {
                console.error('Error fetching specialties:', error);
            }
        }
        fetchSpecialties();
    }, []);

    useEffect(() => {
        if (data?.specialtyIds && specialties.length > 0 && !isPrepopulated) {
            const savedIds = (data.specialtyIds as string).split(', ');
            const savedNames = specialties
                .filter(s => savedIds.includes(s.id))
                .map(s => s.name);

            if (savedNames.length > 0) {
                setSelectedSpecialities(savedNames);
                setIsPrepopulated(true);
            }
        }
    }, [data, specialties, isPrepopulated]);

    const toggleSpeciality = (specialityName: string) => {
        setSelectedSpecialities((prev) =>
            prev.includes(specialityName)
                ? prev.filter((s) => s !== specialityName)
                : [...prev, specialityName]
        );
    };

    const handleNext = () => {
        if (selectedSpecialities.length === 0) return;

        onNext({
            step: 4,
            specialties: selectedSpecialities
        });
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
                        {error && (
                            <div className="w-full mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200 text-center">
                                {error.message || 'Something went wrong. Please try again.'}
                            </div>
                        )}
                        {specialties.map((s) => {
                            const isSelected = selectedSpecialities.includes(s.name);
                            return (
                                <SelectableButton
                                    key={s.id}
                                    label={s.name}
                                    selected={isSelected}
                                    onClick={() => toggleSpeciality(s.name)}
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
                    onClick={onBack}
                    className="w-full sm:w-[150px] h-[52px] rounded-full text-base font-bold bg-white text-black border !border-black hover:bg-gray-50"
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={isPending || selectedSpecialities.length === 0}
                    className="bg-black hover:bg-gray-800 text-white w-full sm:w-[250px] h-[52px] rounded-full text-base font-bold"
                >
                    {isPending ? 'Saving...' : 'Next'}
                </Button>
            </div>
        </div>
    );
}
