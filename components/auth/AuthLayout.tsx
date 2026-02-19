interface AuthLayoutProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    subtitle?: string;
    footer?: React.ReactNode;
}

export function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F9FAFB] px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[538px] bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:px-[100px] md:py-[50px] transition-all duration-300 border border-gray-100">

                {/* Header */}
                {(title || subtitle) && (
                    <div className="text-center mb-[40px]">
                        {title && (
                            <h1 className="font-bebas text-[40px] leading-none mb-2 text-gray-900">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="font-roboto text-[17px] text-text-dark tracking-normal">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Content */}
                {children}

                {/* Footer */}
                {footer && (
                    <div className="mt-10 text-center">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
