'use client';

import { api } from '@/lib/api';

/**
 * Hook to access the standardized API client in React components.
 * Automatically injects the user authentication token into all requests.
 *
 * @example
 * const api = useApi();
 * const res = await api.post('/api/admin/subscriptions/...', { note: trimmed });
 */
export function useApi() {
  return api;
}

export { api };
export default useApi;
