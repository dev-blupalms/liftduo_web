'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

export default function SignupPage() {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Form fields state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        gender: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Clear error when user types
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (!formData.fullName) newErrors.fullName = 'Full Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Signup submitted:', formData);
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
            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Full Name */}
                <Input
                    id="fullName"
                    label="Full Name"
                    placeholder="Enter here"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                />

                {/* Email */}
                <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Enter here"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
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
                    value={formData.gender}
                    onChange={handleChange}
                    error={errors.gender}
                />

                {/* Password */}
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter Here"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                />

                {/* Confirm Password */}
                <Input
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="Enter Here"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                />

                {/* Signup Button */}
                <Button type="submit" fullWidth className="text-white mt-2">
                    Signup
                </Button>
            </form>
        </AuthLayout>
    );
}
