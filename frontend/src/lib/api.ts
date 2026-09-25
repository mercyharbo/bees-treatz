import { Category, PostcodeValidationResponse, OrderRecord } from '../types';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Resolves the appropriate API base URL dynamically:
 * - On the client (browser): relative '/api' (proxied via Next.js Route Handler)
 * - On the server (SSR / RSC): direct backend URL from `process.env.API_URL`
 */
export function getBaseApiUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return (process.env.API_URL || 'https://bees-treatz.onrender.com/api').replace(/\/$/, '');
}

/**
 * Extracts a readable error message from backend error responses.
 */
export function extractErrorMessage(err: unknown, fallback = 'An unexpected error occurred'): string {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (typeof err === 'object') {
    const errorObj = err as Record<string, unknown>;
    if (typeof errorObj.error === 'string') return errorObj.error;
    if (typeof errorObj.message === 'string') return errorObj.message;
    if (Array.isArray(errorObj.errors) && errorObj.errors.length > 0) {
      return String(errorObj.errors[0]);
    }
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

/**
 * Universal JSON fetch helper with automatic Auth token injection
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseApiUrl();
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Normalize if caller passed '/api/...' and baseUrl is already '/api'
  if (baseUrl === '/api' && cleanEndpoint.startsWith('/api/')) {
    cleanEndpoint = cleanEndpoint.slice(4);
  }

  const url = `${baseUrl}${cleanEndpoint}`;
  const headers = new Headers(options.headers || {});

  // Auto-inject Authorization header from Zustand store or localStorage if not provided
  if (!headers.has('Authorization')) {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      try {
        token = useAuthStore.getState().token || localStorage.getItem('bt_auth_token');
      } catch {
        // Fallback for non-standard environments
      }
    }
    if (token && token.trim().length > 0) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Set default JSON Content-Type when body is not FormData
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = extractErrorMessage(data, `Request failed with status ${res.status}`);
    const error = new Error(message);
    (error as unknown as { status: number; data: unknown }).status = res.status;
    (error as unknown as { status: number; data: unknown }).data = data;
    throw error;
  }

  return data as T;
}

/**
 * Standardized API client for all HTTP methods with automatic auth injection
 *
 * @example
 * const res = await api.post<CreateUserResponse>('/admin/users', { name });
 * const data = await api.get<UserProfile>('/auth/me');
 */
export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

// -------------------------------------------------------------
// Typed API Services
// -------------------------------------------------------------

export async function fetchMenu(): Promise<Category[]> {
  const data = await api.get<{ categories?: Category[] }>('/menu', { cache: 'no-store' });
  return data.categories || [];
}

export async function validatePostcode(
  postcode: string,
  subtotal: number = 0
): Promise<PostcodeValidationResponse> {
  const data = await api.post<{ data: PostcodeValidationResponse }>('/delivery/validate-postcode', {
    postcode,
    subtotal,
  });
  return data.data;
}

export async function submitOrder(orderPayload: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'DELIVERY' | 'COLLECTION';
  deliveryAddress?: string;
  deliveryPostcode?: string;
  specialInstructions?: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    selectedOptions?: Array<{
      groupName: string;
      optionName: string;
      additionalPrice: number;
    }>;
  }>;
}): Promise<OrderRecord> {
  const data = await api.post<{ order: OrderRecord }>('/orders', orderPayload);
  return data.order;
}

export async function createCheckoutSession(orderId: string): Promise<{
  checkoutUrl: string;
  isSimulated?: boolean;
}> {
  return await api.post<{
    checkoutUrl: string;
    isSimulated?: boolean;
  }>('/payments/create-checkout-session', { orderId });
}

export async function fetchOrderById(idOrNumber: string): Promise<OrderRecord> {
  const data = await api.get<{ order: OrderRecord }>(`/orders/${idOrNumber}`, {
    cache: 'no-store',
  });
  return data.order;
}
