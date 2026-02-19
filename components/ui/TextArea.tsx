'use client';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function TextArea({ label, error, className = '', id, ...props }: TextAreaProps) {
    return (
        <div className="space-y-1.5 w-full relative">
            {label && (
                <label htmlFor={id} className="block text-xs font-roboto text-gray-standard ml-1">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                className={`w-full px-4 py-3.5 bg-white border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'} rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 transition-all placeholder:text-gray-600 resize-none ${className}`}
                {...props}
            />
            {error && (
                <p className="absolute -bottom-[18px] left-1 text-[11px] font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
