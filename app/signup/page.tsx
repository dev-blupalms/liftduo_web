'use client';

import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from '@/lib/validations/auth';
import { useSignup } from '@/hooks/useAuth';

export default function SignupPage() {
    const signup = useSignup();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: '',
            email: '',
            gender: undefined,
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: SignupFormData) => {
        signup.mutate(data);
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
                    Have an account already?{' '}
                    <Link
                        href="/login"
                        className="text-[#F37B2F] hover:text-[#e06a1f] font-medium transition-colors"
                    >
                        Login here
                    </Link>
                </p>
            }
        >
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {/* Global Error Message */}
                {signup.isError && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                        {signup.error?.message || 'Something went wrong. Please try again.'}
                    </div>
                )}

                {/* Full Name */}
                <Input
                    id="fullName"
                    label="Full Name"
                    placeholder="Enter here"
                    {...register('fullName')}
                    error={errors.fullName?.message}
                />

                {/* Email */}
                <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Enter here"
                    {...register('email')}
                    error={errors.email?.message}
                />

                {/* Gender */}
                <Select
                    id="gender"
                    label="Gender"
                    options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                        { label: 'Other', value: 'other' }
                    ]}
                    {...register('gender')}
                    error={errors.gender?.message}
                />

                {/* Password */}
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter Here"
                    {...register('password')}
                    error={errors.password?.message}
                />

                {/* Confirm Password */}
                <Input
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="Enter Here"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                />

                {/* Signup Button */}
                <Button
                    type="submit"
                    fullWidth
                    className="text-white mt-2"
                    disabled={signup.isPending}
                >
                    {signup.isPending ? 'Signing up...' : 'Signup'}
                </Button>
            </form>
        </AuthLayout>
    );
}
