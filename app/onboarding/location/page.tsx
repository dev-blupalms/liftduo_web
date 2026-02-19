'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { Select } from '@/components/ui/Select';

const CITIES = [
    { label: 'California', value: 'california' },
    { label: 'New York', value: 'new_york' },
    { label: 'Texas', value: 'texas' },
    { label: 'Florida', value: 'florida' },
    { label: 'Illinois', value: 'illinois' }
];

export default function OnboardingLocationPage() {
    const router = useRouter();
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

    const handleNext = () => {
        if (!city) {
            setError('Please select a city');
            return;
        }
        console.log('City selected:', city);
        router.push('/onboarding/gym');
    };

    const handleBack = () => {
        router.push('/onboarding');
    };

    return (
        <div className="flex flex-col items-center w-full">
            <OnboardingCard>
                <div className="text-center mb-12 w-full max-w-[400px] mx-auto">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                        Your location
                    </h3>
                    <p className="text-gray-500 text-sm ">
                        Please select the city you live in and where you can work
                    </p>
                </div>

                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[378px]">
                        <Select
                            id="city"
                            label="City"
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                setError('');
                            }}
                            options={CITIES}
                            error={error}
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
