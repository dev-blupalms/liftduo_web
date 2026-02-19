'use client';

interface LogoProps {
    className?: string;
}

export function Logo({ className = '' }: LogoProps) {
    return (
        <h1 className={`font-bebas leading-none text-gray-900 ${className}`}>
            LIFT<span className="text-brand-orange">DUO</span>
        </h1>
    );
}
