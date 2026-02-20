'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useUser } from '@/hooks/useUser';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: user, isLoading, isError } = useUser();

    useEffect(() => {
        if (isError) {
            router.push('/login');
            return;
        }

        if (isLoading || !user) return;

        // If user is already verified and finished onboarding, they shouldn't be here
        if (user.isVerified && user.onboardingStep >= 7) {
            router.replace('/dashboard'); // Or wherever verified users go
            return;
        }

        // If user is NOT on /onboarding but is in the folder (old paths), redirect to /onboarding
        // but let's keep it simple for now, the user will delete old paths.
    }, [user, isLoading, isError, pathname, router]);


    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#F9FAFB]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-[#F9FAFB] pt-10 px-4 sm:px-6 pb-10">
            {/* Header Logo */}
            <div className="mb-12">
                <Logo className="text-[50px]" />
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-[822px] flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
