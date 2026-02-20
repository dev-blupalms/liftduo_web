'use client';

import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

const STEPS = {
    '/onboarding': 1,
    '/onboarding/location': 2,
    '/onboarding/gym': 3,
    '/onboarding/speciality': 4,
    '/onboarding/services': 5,
    '/onboarding/photo': 6,
    // Future steps will be added here
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentStep = STEPS[pathname as keyof typeof STEPS] || 1;

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-[#F9FAFB] pt-10 px-4 sm:px-6 pb-10">
            {/* Header Logo */}
            <div className="mb-12">
                <Logo className="text-[50px]" />
            </div>

            {/* Title & Progress - HIDDEN for Photo and Verification steps */}
            {!['/onboarding/photo', '/onboarding/verification'].includes(pathname) && (
                <>
                    <h2 className="text-4xl font-black text-gray-900 mb-8 text-center tracking-tight">
                        Let&apos;s get you started
                    </h2>

                    {/* Progress Bar */}
                    <div className="flex space-x-3 mb-12">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${step <= currentStep ? 'bg-black' : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Main Content Area */}
            <div className="w-full max-w-[822px] flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
