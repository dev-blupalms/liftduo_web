'use server';

import { cookies } from 'next/headers';
import { SignupFormData, LoginFormData } from '@/lib/validations/auth';
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from '@/lib/auth';

export async function signupAction(data: SignupFormData) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                name: data.fullName,
                role: 'TRAINER', // Hardcoded for this flow
                // phone can be added here if needed
            }),
        });

        const result = await response.json();

        console.log('Signup API Response:', result);

        if (!response.ok) {
            return { error: result.message || 'Signup failed' };
        }

        // Set Cookies
        const cookieStore = await cookies();

        cookieStore.set('accessToken', result.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: ACCESS_TOKEN_MAX_AGE,
            path: '/',
        });

        cookieStore.set('refreshToken', result.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_MAX_AGE,
            path: '/',
        });

        return { success: true, user: result.data.user };
    } catch (error) {
        console.error('Signup action error:', error);
        return { error: 'Something went wrong. Please try again.' };
    }
}

export async function loginAction(data: LoginFormData) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        });

        const result = await response.json();

        console.log('Login API Response:', result);

        if (!response.ok) {
            return { error: result.message || 'Login failed' };
        }

        // Set Cookies
        const cookieStore = await cookies();

        cookieStore.set('accessToken', result.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: ACCESS_TOKEN_MAX_AGE,
            path: '/',
        });

        cookieStore.set('refreshToken', result.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_MAX_AGE,
            path: '/',
        });

        return { success: true, user: result.data.user };
    } catch (error) {
        console.error('Login action error:', error);
        return { error: 'Something went wrong. Please try again.' };
    }
}
