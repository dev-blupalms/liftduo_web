'use client';

import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { Button } from '@/components/ui/Button';

interface BioStepProps {
    data?: Record<string, unknown>;
    onNext: (data: { step: number; bio: string }) => void;
    isPending: boolean;
    error: Error | null;
}

export function BioStep({ data, onNext, isPending, error }: BioStepProps) {
    const [bio, setBio] = useState((data?.bio as string) || '');
    const [localError, setLocalError] = useState('');

    const handleNext = () => {
        if (!bio.trim()) {
            setLocalError('Bio is required');
            return;
        }

        onNext({
            step: 1,
            bio: bio.trim()
        });
    };

    return (
        <div className="flex flex-col items-center w-full">
            <OnboardingCard>
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                        Tell us about yourself
                    </h3>
                    <p className="text-gray-500">
                        Please enter your journey (this will be shown on your profile)
                    </p>
                </div>

                <div className="w-full">
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                            {error.message || 'Something went wrong. Please try again.'}
                        </div>
                    )}
                    <TextArea
                        id="bio"
                        label="Bio"
                        placeholder="Enter here"
                        rows={6}
                        value={bio}
                        onChange={(e) => {
                            setBio(e.target.value);
                            setLocalError('');
                        }}
                        error={localError}
                    />
                </div>
            </OnboardingCard>

            <div className="w-full flex justify-end mt-[40px]">
                <Button
                    onClick={handleNext}
                    disabled={isPending}
                    className="bg-black hover:bg-gray-800 text-white w-full sm:w-[250px] h-[52px] rounded-full text-base font-bold"
                >
                    {isPending ? 'Saving...' : 'Next'}
                </Button>
            </div>
        </div>
    );
}
