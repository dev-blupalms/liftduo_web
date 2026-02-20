'use client';

interface SelectableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    selected: boolean;
    label: string;
    onClick: () => void;
    className?: string;
}

export function SelectableButton({ selected, label, onClick, className = '', ...props }: SelectableButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`border transition-all font-medium ${selected
                ? 'border-[#F37B2F] bg-[#F4F4F4] text-[#0F0F0F] ring-1 ring-[#F37B2F]'
                : 'border-transparent bg-[#F4F4F4] text-[#0F0F0F] hover:bg-gray-200'
                } ${className}`}
            {...props}
        >
            {label}
        </button>
    );
}
