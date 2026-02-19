'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';

export default function OnboardingBioPage() {
    const router = useRouter();
    const [bio, setBio] = useState('');
    const [error, setError] = useState('');

    const handleNext = () => {
        if (!bio.trim()) {
            setError('Bio is required');
            return;
        }
        console.log('Bio submitted:', bio);
        router.push('/onboarding/location');
    };

    return (
        <div className="flex flex-col items-center w-full">
            <OnboardingCard>
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                        Tell us about yourself
                    </h3>
                    <p className="text-gray-500">
                        Please enter your journey(this will be shown on your profile)
                    </p>
                </div>

                <div className="w-full">
                    <TextArea
                        id="bio"
                        label="Bio"
                        placeholder="Enter here"
                        rows={6}
                        value={bio}
                        onChange={(e) => {
                            setBio(e.target.value);
                            setError('');
                        }}
                        error={error}
                    />
                </div>
            </OnboardingCard>

            <div className="w-full flex justify-end mt-[40px]">
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
