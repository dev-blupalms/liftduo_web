'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Login submitted:', formData);
        }
    };

    return (
        <AuthLayout
            title={
                <>
                    WELCOME TO <span className="text-[#F37B2F]">LIFTDUO</span>
                </>
            }
            subtitle="Train People. Make Money. Your Schedule."
            footer={
                <p className="text-[13px] text-text-dark font-medium">
                    Don’t have an account?{' '}
                    <Link
                        href="/signup"
                        className="text-[#F37B2F] hover:text-[#e06a1f] font-medium transition-colors"
                    >
                        Signup here
                    </Link>
                </p>
            }
        >
            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email */}
                <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Enter here"
                    error={errors.email}
                    value={formData.email}
                    onChange={handleChange}
                />

                {/* Password */}
                <div>
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="Enter here"
                        error={errors.password}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className="flex justify-end pt-1">
                        <Link
                            href="/forgot-password"
                            className="font-roboto text-sm text-text-dark hover:underline"
                        >
                            Forgot Password
                        </Link>
                    </div>
                </div>

                {/* Login Button */}
                <Button type="submit" fullWidth className="text-white">
                    Login
                </Button>
            </form>
        </AuthLayout>
    );
}
