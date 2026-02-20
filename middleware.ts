import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add the routes that require authentication
const protectedRoutes = [
    '/onboarding',
    '/dashboard',
    '/admin'
    // add more routes here as needed
];

// Add the routes that unauthenticated users should access
const authRoutes = [
    '/login',
    '/signup'
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the current route is protected or auth route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Get tokens from cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const isAuthenticated = !!(accessToken || refreshToken);

    // If attempting to access a protected route without being authenticated
    if (isProtectedRoute && !isAuthenticated) {
        const url = new URL('/login', request.url);
        // Optional: Save the attempted url to redirect back after login
        // url.searchParams.set('callbackUrl', encodeURI(request.url));
        return NextResponse.redirect(url);
    }

    // If attempting to access login/signup while already authenticated
    if (isAuthRoute && isAuthenticated) {
        // Redirect to a default authenticated route. 
        // Ideally, we'd know if they finished onboarding, but we'll send to /dashboard 
        // or /onboarding and let the layout handle the rest.
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|.*\\.).*)',
    ],
};
