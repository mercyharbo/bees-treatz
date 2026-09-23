import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

const PROTECTED_ROUTES = ['/profile'];

/**
 * Edge Proxy Route Interceptor
 * - Redirects authenticated users attempting to access (auth) pages to /profile
 * - Redirects unauthenticated users attempting to access /profile to /login
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('bt_auth_token')?.value;
  const isAuthenticated = Boolean(token && token.trim().length > 0);

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If logged in and trying to access an auth page, redirect to /profile
  if (isAuthenticated && isAuthRoute) {
    const url = new URL('/profile', request.url);
    return NextResponse.redirect(url);
  }

  // If not logged in and trying to access a protected page, redirect to /login
  if (!isAuthenticated && isProtectedRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/profile',
    '/profile/:path*',
  ],
};
