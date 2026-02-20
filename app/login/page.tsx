'use client';

import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
    const login = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormData) => {
        login.mutate(data);
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
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {/* Global Error Message */}
                {login.isError && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                        {login.error?.message || 'Something went wrong. Please try again.'}
                    </div>
                )}

                {/* Email */}
                <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Enter here"
                    {...register('email')}
                    error={errors.email?.message}
                />

                {/* Password */}
                <div>
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="Enter here"
                        {...register('password')}
                        error={errors.password?.message}
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
                <Button
                    type="submit"
                    fullWidth
                    className="text-white"
                    disabled={login.isPending}
                >
                    {login.isPending ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </AuthLayout>
    );
}
