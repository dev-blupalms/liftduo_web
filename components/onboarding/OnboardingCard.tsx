'use client';

export function OnboardingCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`w-full bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-8 py-8 md:px-[80px] md:py-[40px] transition-all border border-gray-100 ${className}`}>
            {children}
        </div>
    );
}
