import { create } from 'zustand';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import { UserProfile } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

function isJwtExpired(token: string | null): boolean {
  if (!token || typeof token !== 'string') return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    return payload.exp * 1000 <= Date.now() + 10000; // 10s buffer
  } catch {
    return true;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (token: string, user: UserProfile) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bt_auth_token', token);
        localStorage.setItem('bt_auth_user', JSON.stringify(user));
        // Sync access token cookie for Next.js proxy/server requests (15 minutes)
        document.cookie = `bt_auth_token=${encodeURIComponent(token)}; path=/; max-age=900; SameSite=Lax`;
      } catch (e) {
        console.error('Failed to store auth session:', e);
      }
    }
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  setUser: (user: UserProfile) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bt_auth_user', JSON.stringify(user));
      } catch (e) {
        console.error('Failed to update stored user:', e);
      }
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('bt_auth_token');
        localStorage.removeItem('bt_auth_user');
        // Expire both access token and refresh token cookies
        document.cookie = 'bt_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        document.cookie = 'bt_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        // Invalidate cached profile in SWR
        mutate('/auth/me', null, false);
      } catch (e) {
        console.error('Failed to clear auth session:', e);
      }
    }
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  initialize: async () => {
    if (typeof window === 'undefined') {
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const token = localStorage.getItem('bt_auth_token');
      const userStr = localStorage.getItem('bt_auth_user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        const expired = isJwtExpired(token);

        if (!expired) {
          // Token is valid; ensure cookie is fresh
          document.cookie = `bt_auth_token=${encodeURIComponent(token)}; path=/; max-age=900; SameSite=Lax`;
          set({ token, user, isAuthenticated: true, isLoading: false });
          return;
        }

        // Token expired, but user data exists.
        // Maintain optimistic authenticated UI while refreshing in background.
        set({ token, user, isAuthenticated: true, isLoading: false });

        try {
          const res = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          if (res.ok) {
            const data = await res.json();
            if (data?.token && data?.user) {
              useAuthStore.getState().setAuth(data.token, data.user);
              return;
            }
          }
        } catch {
          // Network failure or refresh failure
        }

        // If refresh failed, session is completely expired
        useAuthStore.getState().logout();
        return;
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    }

    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },
}));

/**
 * Hydration helper to safely consume auth store without hydration errors
 */
export function useHydratedAuthStore<T>(
  selector: (state: AuthState) => T,
  fallback: T
): T {
  const result = useAuthStore(selector);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? result : fallback;
}

/**
 * Global component mounted in RootLayout to ensure authentication is initialized
 * across every route on the client.
 */
export function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
