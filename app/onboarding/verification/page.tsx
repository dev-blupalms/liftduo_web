'use client';

import Image from 'next/image';

export default function VerificationPage() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 w-full font-roboto">
            <div className="w-full max-w-[822px] mx-auto text-center bg-white p-[40px] rounded-[12px] shadow-[0_0_40px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col items-center justify-center">
                    <div className="relative w-[76px] h-[76px] mb-6">
                        <Image
                            src="/images/approval_waiting.png"
                            alt="Verification Pending"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h3 className="text-[16px] font-bold text-gray-900 mb-2">
                        We are verifying your details
                    </h3>
                    <p className="text-[12px] text-gray-500">
                        Please sit tight. We are verifying your profile and will let you know by email.
                    </p>
                </div>
            </div>
        </div>
    );
}
