'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { Input } from '@/components/ui/Input';
import { PlacesAutocomplete } from '@/components/ui/PlacesAutocomplete';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { getGeocode } from 'use-places-autocomplete';

const libraries: Libraries = ['places'];

interface LocationStepProps {
    data?: Record<string, unknown>;
    onNext: (data: { step: number;[key: string]: unknown }) => void;
    onBack: () => void;
    isPending: boolean;
    error: Error | null;
}

export function LocationStep({ data, onNext, onBack, isPending, error }: LocationStepProps) {
    const [address, setAddress] = useState(() => {
        if (data?.location) {
            const parts = (data.location as string).split(', ');
            return parts.length > 0 ? parts[0] : '';
        }
        return '';
    });
    const [country, setCountry] = useState((data?.country as string) || '');
    const [state, setState] = useState((data?.state as string) || '');
    const [city, setCity] = useState((data?.city as string) || '');
    const [zip, setZip] = useState((data?.zip as string) || '');
    const [localError, setLocalError] = useState('');

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: libraries
    });

    const handleNext = () => {
        if (!address || !country || !state || !city || !zip) {
            setLocalError('Please fill in all fields');
            return;
        }

        const fullLocation = `${address}, ${city}, ${state}, ${zip}, ${country}`;
        onNext({
            step: 2,
            location: fullLocation,
            country,
            state,
            city,
            zip
        });
    };

    const handleAddressSelect = async (selectedAddress: string) => {
        setAddress(selectedAddress);
        setLocalError('');

        try {
            const results = await getGeocode({ address: selectedAddress });
            if (results && results[0]) {
                const components = results[0].address_components;

                let newCity = '';
                let newState = '';
                let newCountry = '';
                let newZip = '';

                components.forEach((component) => {
                    const types = component.types;
                    if (types.includes('locality')) {
                        newCity = component.long_name;
                    }
                    if (types.includes('administrative_area_level_1')) {
                        newState = component.long_name;
                    }
                    if (types.includes('country')) {
                        newCountry = component.long_name;
                    }
                    if (types.includes('postal_code')) {
                        newZip = component.long_name;
                    }
                });

                if (newCity) setCity(newCity);
                if (newState) setState(newState);
                if (newCountry) setCountry(newCountry);
                if (newZip) setZip(newZip);
            }
        } catch (error) {
            console.error('Error parsing address:', error);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <OnboardingCard>
                <div className="text-center mb-12 w-full max-w-[400px] mx-auto">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                        Your location
                    </h3>
                    <p className="text-gray-500 text-sm ">
                        Please select the address you live in and where you can work
                    </p>
                </div>

                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[378px] space-y-8">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                                {error.message || 'Something went wrong. Please try again.'}
                            </div>
                        )}
                        {isLoaded ? (
                            <PlacesAutocomplete
                                id="address"
                                label="Full Address"
                                value={address}
                                onChange={(value) => {
                                    setAddress(value);
                                    setLocalError('');
                                }}
                                onSelect={handleAddressSelect}
                                error={localError && !address ? 'Address is required' : ''}
                                types={['address']}
                            />
                        ) : (
                            <Input
                                id="address"
                                label="Full Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                error={localError && !address ? 'Address is required' : ''}
                            />
                        )}

                        {isLoaded ? (
                            <PlacesAutocomplete
                                id="country"
                                label="Country"
                                value={country}
                                onChange={(value) => {
                                    setCountry(value);
                                    setLocalError('');
                                }}
                                onSelect={(val) => setCountry(val)}
                                error={localError && !country ? 'Country is required' : ''}
                                types={['(regions)']}
                            />
                        ) : (
                            <Input
                                id="country"
                                label="Country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                error={localError && !country ? 'Country is required' : ''}
                            />
                        )}

                        {isLoaded ? (
                            <PlacesAutocomplete
                                id="state"
                                label="State"
                                value={state}
                                onChange={(value) => {
                                    setState(value);
                                    setLocalError('');
                                }}
                                onSelect={(val) => setState(val)}
                                error={localError && !state ? 'State is required' : ''}
                                types={['administrative_area_level_1']}
                            />
                        ) : (
                            <Input
                                id="state"
                                label="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                error={localError && !state ? 'State is required' : ''}
                            />
                        )}

                        {isLoaded ? (
                            <PlacesAutocomplete
                                id="city"
                                label="City"
                                value={city}
                                onChange={(value) => {
                                    setCity(value);
                                    setLocalError('');
                                }}
                                onSelect={(val) => setCity(val)}
                                error={localError && !city ? 'City is required' : ''}
                                types={['(cities)']}
                            />
                        ) : (
                            <Input
                                id="city"
                                label="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                error={localError && !city ? 'City is required' : ''}
                            />
                        )}

                        <Input
                            id="zip"
                            label="Zip Code"
                            value={zip}
                            onChange={(e) => {
                                setZip(e.target.value);
                                setLocalError('');
                            }}
                            error={localError && !zip ? 'Zip Code is required' : ''}
                        />
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
                    disabled={isPending}
                    className="bg-black hover:bg-gray-800 text-white w-full sm:w-[250px] h-[52px] rounded-full text-base font-bold"
                >
                    {isPending ? 'Saving...' : 'Next'}
                </Button>
            </div>
        </div>
    );
}
