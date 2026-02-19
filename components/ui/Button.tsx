import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
}

export function Button({
    children,
    className = '',
    variant = 'primary',
    fullWidth = false,
    ...props
}: ButtonProps) {

    const baseStyles = "font-bold py-3.5 rounded-[30px] text-sm transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-black hover:bg-gray-900 text-white shadow-lg shadow-gray-200",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
        outline: "bg-transparent border border-gray-200 hover:bg-gray-50 text-gray-900"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
