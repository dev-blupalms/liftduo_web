'use server';

import { cookies } from 'next/headers';

export async function updateTrainerOnboardingAction(data: Record<string, unknown>) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return { error: 'Unauthorized' };
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/onboarding/trainer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.message || 'Onboarding update failed' };
        }

        return { success: true, nextStep: result.nextStep };
    } catch (error) {
        console.error('Onboarding action error:', error);
        return { error: 'Something went wrong. Please try again.' };
    }
}
