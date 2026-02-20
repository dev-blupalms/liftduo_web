'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import Image from 'next/image';

export default function OnboardingPhotoPage() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleNext = () => {
        console.log('Photo step submitted', selectedImage ? 'Image uploaded' : 'No image');
        // Final step or next step
        router.push('/onboarding/verification');
    };

    const handleBack = () => {
        router.push('/onboarding/services');
    };

    return (
        <div className="flex flex-col items-center w-full font-roboto">
            <OnboardingCard>
                <div className="text-center mb-10 w-full max-w-[662px] mx-auto">
                    <h3 className="text-[24px] font-black text-gray-900 mb-2">
                        Your photo
                    </h3>
                    <p className="text-[18px] text-[#666666]">
                        Please upload a photo of yours, Make sure your face is clear
                    </p>
                </div>

                <div className="w-full flex justify-center">
                    <div className="flex flex-col items-center justify-center w-full max-w-[400px]">

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="hidden"
                        />

                        <div
                            onClick={handleClick}
                            className="w-[220px] h-[220px] rounded-full bg-[#F4F4F4] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative overflow-hidden"
                        >
                            {/* Custom Dashed Border SVG */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 220 220">
                                <circle
                                    cx="110"
                                    cy="110"
                                    r="109.5"
                                    fill="none"
                                    stroke="#0F0F0F"
                                    strokeWidth="1"
                                    strokeDasharray="6 6" // Tuned for better visual balance
                                />
                            </svg>

                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt="Profile"
                                    fill
                                    className="object-cover rounded-full"
                                />
                            ) : (
                                // Placeholder Image - Path as requested by user
                                <div className="relative w-[75px] h-[75px] opacity-75">
                                    <Image
                                        src="/images/upload_placeholder.png"
                                        alt="Upload placeholder"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="text-center mt-6">
                            <h4 className="text-[16px] font-bold text-gray-900 mb-1">Your Photo</h4>
                            <p className="text-[14px] text-gray-500">Please make sure your face is clear.</p>
                        </div>
                    </div>
                </div>
            </OnboardingCard>

            <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-end gap-[15px] sm:gap-[10px] mt-[40px]">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="w-full sm:w-[150px] h-[52px] rounded-full text-base font-bold bg-white text-black border !border-black hover:bg-gray-50 bg-opacity-0"
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    className="bg-black hover:bg-gray-800 text-white w-full sm:w-[250px] h-[52px] rounded-full text-base font-bold"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}
