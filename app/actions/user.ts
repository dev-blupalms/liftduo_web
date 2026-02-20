'use server';

import { cookies } from 'next/headers';

export async function getCurrentUserAction() {
    try {
        const cookieStore = await cookies();
        let accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (!accessToken && !refreshToken) {
            return { error: 'Unauthorized' };
        }

        let response = null;
        if (accessToken) {
            response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
        }

        // If access token is missing or expired, attempt to refresh
        if (!response || response.status === 401) {
            if (!refreshToken) {
                return { error: 'Unauthorized' };
            }

            const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                accessToken = refreshData.data.accessToken;
                const newRefreshToken = refreshData.data.refreshToken;

                cookieStore.set('accessToken', accessToken as string, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60, // 15 mins
                    path: '/',
                });

                cookieStore.set('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60, // 7 days
                    path: '/',
                });

                // Retry original request
                response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/me`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
            } else {
                // Refresh failed, clear cookies fully to break loop
                cookieStore.delete('accessToken');
                cookieStore.delete('refreshToken');
                return { error: 'Unauthorized' };
            }
        }

        if (!response || !response.ok) {
            const result = response ? await response.json() : {};
            return { error: result?.message || 'Failed to fetch user' };
        }

        const result = await response.json();
        return { success: true, data: result.data };
    } catch (error) {
        console.error('Get current user action error:', error);
        return { error: 'Something went wrong.' };
    }
}
