import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

const PROTECTED_ROUTES = [
  '/profile',
  '/checkout',
  '/admin',
];

/**
 * Next.js Official Proxy Interceptor
 * - Runs before incoming requests hit pages
 * - Redirects authenticated users attempting to access auth routes to /profile
 * - Redirects unauthenticated users attempting to access protected routes to /login
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('bt_auth_token')?.value;
  const isAuthenticated = Boolean(token && token.trim().length > 0);

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If logged in and trying to access an auth page, redirect to /profile (or ?redirect=...)
  if (isAuthenticated && isAuthRoute) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    const destination = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/profile';
    const url = new URL(destination, request.url);
    return NextResponse.redirect(url);
  }

  // If not logged in and trying to access a protected page, redirect to /login?redirect=...
  if (!isAuthenticated && isProtectedRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/profile',
    '/profile/:path*',
    '/checkout',
    '/admin',
    '/admin/:path*',
  ],
};
