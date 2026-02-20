'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';

const LOCATIONS = [
    { label: 'In person', value: 'OFFLINE' },
    { label: 'Online', value: 'ONLINE' },
];

const DAYS = Array.from({ length: 7 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString()
}));

interface ServicesStepProps {
    data?: Record<string, unknown>;
    onNext: (data: { step: number; services: Record<string, unknown>[] }) => void;
    onBack: () => void;
    isPending: boolean;
    error: Error | null;
}

export function ServicesStep({ data, onNext, onBack, isPending, error }: ServicesStepProps) {
    const [formData, setFormData] = useState(() => {
        const defaultData = {
            thirtyMin: {
                location: '',
                days: '',
                price: '',
                description: ''
            },
            oneHour: {
                location: '',
                days: '',
                price: '',
                description: ''
            }
        };

        if (data?.services && Array.isArray(data.services)) {
            const services = data.services;
            const thirty = services.find((s: Record<string, unknown>) => s.durationMinutes === 30);
            const hour = services.find((s: Record<string, unknown>) => s.durationMinutes === 60);

            if (thirty) {
                defaultData.thirtyMin = {
                    location: (thirty.locationType as string) || '',
                    days: '',
                    price: (thirty.price as number)?.toString() || '',
                    description: (thirty.description as string) || ''
                };
            }
            if (hour) {
                defaultData.oneHour = {
                    location: (hour.locationType as string) || '',
                    days: '',
                    price: (hour.price as number)?.toString() || '',
                    description: (hour.description as string) || ''
                };
            }
        }
        return defaultData;
    });

    const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});



    const handleChange = (section: 'thirtyMin' | 'oneHour', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNext = () => {
        const services = [];

        if (formData.thirtyMin.price) {
            services.push({
                title: '30 Minutes Training',
                durationMinutes: 30,
                price: formData.thirtyMin.price,
                description: formData.thirtyMin.description,
                locationType: formData.thirtyMin.location || 'ONLINE'
            });
        }

        if (formData.oneHour.price) {
            services.push({
                title: '1 Hour Training',
                durationMinutes: 60,
                price: formData.oneHour.price,
                description: formData.oneHour.description,
                locationType: formData.oneHour.location || 'ONLINE'
            });
        }

        if (services.length === 0) {
            setLocalErrors({ global: 'Please enter details for at least one service' });
            return;
        }

        onNext({
            step: 5,
            services
        });
    };

    return (
        <div className="flex flex-col items-center w-full font-roboto">
            <OnboardingCard>
                <div className="text-center mb-8 w-full max-w-[662px] mx-auto">
                    <h3 className="text-[24px] font-black text-gray-900 mb-2">
                        Service & Pricing
                    </h3>
                    <p className="text-[18px] text-[#666666]">
                        Please enter details for 2 services & the pricing
                    </p>
                </div>

                <div className="w-full space-y-8 max-w-[450px] mx-auto">
                    {(error || localErrors.global) && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                            {error?.message || localErrors.global || 'Something went wrong. Please try again.'}
                        </div>
                    )}
                    {/* 30 Minutes Training */}
                    <div>
                        <h4 className="text-[16px] font-medium text-[#F37B2F] mb-4">
                            30 minutes training
                        </h4>
                        <div className="space-y-4">
                            <Select
                                id="thirtyMin.location"
                                label="Location"
                                options={LOCATIONS}
                                value={formData.thirtyMin.location}
                                onChange={(e) => handleChange('thirtyMin', 'location', e.target.value)}
                            />
                            <Select
                                id="thirtyMin.days"
                                label="No of days"
                                options={DAYS}
                                value={formData.thirtyMin.days}
                                onChange={(e) => handleChange('thirtyMin', 'days', e.target.value)}
                            />
                            <Input
                                id="thirtyMin.price"
                                label="Price"
                                placeholder="Enter here"
                                type="number"
                                value={formData.thirtyMin.price}
                                onChange={(e) => handleChange('thirtyMin', 'price', e.target.value)}
                            />
                            <TextArea
                                id="thirtyMin.description"
                                label="Description"
                                placeholder="Enter here"
                                rows={3}
                                value={formData.thirtyMin.description}
                                onChange={(e) => handleChange('thirtyMin', 'description', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 1 Hour Training */}
                    <div>
                        <h4 className="text-[16px] font-medium text-[#F37B2F] mb-4">
                            1 hour training
                        </h4>
                        <div className="space-y-4">
                            <Select
                                id="oneHour.location"
                                label="Location"
                                options={LOCATIONS}
                                value={formData.oneHour.location}
                                onChange={(e) => handleChange('oneHour', 'location', e.target.value)}
                            />
                            <Select
                                id="oneHour.days"
                                label="No of days"
                                options={DAYS}
                                value={formData.oneHour.days}
                                onChange={(e) => handleChange('oneHour', 'days', e.target.value)}
                            />
                            <Input
                                id="oneHour.price"
                                label="Price"
                                placeholder="Enter here"
                                type="number"
                                value={formData.oneHour.price}
                                onChange={(e) => handleChange('oneHour', 'price', e.target.value)}
                            />
                            <TextArea
                                id="oneHour.description"
                                label="Description"
                                placeholder="Enter here"
                                rows={3}
                                value={formData.oneHour.description}
                                onChange={(e) => handleChange('oneHour', 'description', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </OnboardingCard>

            <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-end gap-[15px] sm:gap-[10px] mt-[40px]">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="w-full sm:w-[150px] h-[52px] rounded-full text-base font-bold bg-white text-black border !border-black hover:bg-gray-50 bg-opacity-0"
                >
                    Back
                </Button>
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
