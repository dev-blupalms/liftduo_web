'use client';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
    return (
        <div className="space-y-1.5 w-full relative">
            {label && (
                <label htmlFor={id} className="block text-xs font-roboto text-gray-standard ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    className={`w-full px-4 py-3.5 bg-white border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'} rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${className}`}
                    {...props}
                >
                    <option value="" disabled>Select</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-standard">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="absolute -bottom-[18px] left-1 text-[11px] font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
