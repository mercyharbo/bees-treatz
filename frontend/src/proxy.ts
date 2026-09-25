import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

const BACKEND_BASE_URL = (process.env.API_URL || 'https://bees-treatz.onrender.com/api').replace(/\/$/, '');

/**
 * Checks if a JWT string is structurally valid and unexpired
 */
function isTokenValid(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    if (!payload || typeof payload !== 'object') return false;
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false; // Expired
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Next.js Official Edge Proxy Interceptor
 * - Protects /profile and /admin without forcing unnecessary login walls on hungry customers.
 * - Leaves /checkout open for frictionless guest ordering.
 * - Transparently uses refresh token at the network edge if access token expired while laptop was shut.
 * - If session cannot be refreshed, redirects gracefully to '/' (Index page) so user stays in the food browsing experience.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('bt_auth_token')?.value;
  const refreshToken = request.cookies.get('bt_refresh_token')?.value;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isProfileRoute = pathname === '/profile' || pathname.startsWith('/profile/');
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  const hasValidAccessToken = isTokenValid(accessToken);

  // If visiting an auth page while already authenticated, redirect to /profile
  if (hasValidAccessToken && isAuthRoute) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    const destination = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/profile';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Handle protected Customer Profile routes
  if (isProfileRoute) {
    // 1. If access token is valid, proceed immediately
    if (hasValidAccessToken) {
      return NextResponse.next();
    }

    // 2. If access token is expired/missing, attempt transparent refresh using refresh token
    if (refreshToken && refreshToken.trim().length > 0) {
      try {
        const refreshResponse = await fetch(`${BACKEND_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `bt_refresh_token=${refreshToken}`,
          },
          body: JSON.stringify({ refreshToken }),
          cache: 'no-store',
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          if (data?.token && data?.refreshToken) {
            // Refresh succeeded! Update cookies on response and proceed to /profile
            const response = NextResponse.next();
            const isProd = process.env.NODE_ENV === 'production';

            response.cookies.set('bt_auth_token', data.token, {
              path: '/',
              maxAge: 15 * 60, // 15 minutes
              sameSite: 'lax',
              secure: isProd,
            });

            response.cookies.set('bt_refresh_token', data.refreshToken, {
              path: '/',
              maxAge: 30 * 24 * 60 * 60, // 30 days
              httpOnly: true,
              sameSite: 'lax',
              secure: isProd,
            });

            return response;
          }
        }
      } catch (err) {
        console.error('Edge proxy token refresh failed:', err);
      }
    }

    // 3. Refresh failed or no refresh token: redirect to '/' (Index page) so user stays in the food ordering flow
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('bt_auth_token');
    response.cookies.delete('bt_refresh_token');
    return response;
  }

  // Handle protected Admin routes
  if (isAdminRoute) {
    if (!hasValidAccessToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
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
    '/admin',
    '/admin/:path*',
  ],
};
