import { create } from 'zustand';
import { useEffect, useState } from 'react';
import { UserProfile } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  initialize: () => void;
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
        // Sync cookie for Next.js proxy/middleware server redirects
        document.cookie = `bt_auth_token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
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
        // Expire cookie
        document.cookie = 'bt_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      } catch (e) {
        console.error('Failed to clear auth session:', e);
      }
    }
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('bt_auth_token');
        const userStr = localStorage.getItem('bt_auth_user');
        if (token && userStr) {
          const user = JSON.parse(userStr);
          // Ensure cookie is synced
          document.cookie = `bt_auth_token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
          set({ token, user, isAuthenticated: true, isLoading: false });
          return;
        }
      } catch (e) {
        console.error('Failed to restore auth session:', e);
      }
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
