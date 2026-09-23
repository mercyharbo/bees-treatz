import { Category, PostcodeValidationResponse, OrderRecord } from '../types';

/**
 * Resolves the appropriate API base URL dynamically:
 * - On the client (browser): relative '/api' (proxied via Next.js Route Handler, hiding internal ports/domains)
 * - On the server (SSR / RSC): direct backend URL from `process.env.API_URL`
 */
export function getBaseApiUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return (process.env.API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
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
 * Universal JSON fetch helper
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseApiUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});
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

// -------------------------------------------------------------
// Typed API Services
// -------------------------------------------------------------

export async function fetchMenu(): Promise<Category[]> {
  const data = await apiFetch<{ categories?: Category[] }>('/menu', { cache: 'no-store' });
  return data.categories || [];
}

export async function validatePostcode(
  postcode: string,
  subtotal: number = 0
): Promise<PostcodeValidationResponse> {
  const data = await apiFetch<{ data: PostcodeValidationResponse }>('/delivery/validate-postcode', {
    method: 'POST',
    body: JSON.stringify({ postcode, subtotal }),
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
  const data = await apiFetch<{ order: OrderRecord }>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  });
  return data.order;
}

export async function createCheckoutSession(orderId: string): Promise<{
  checkoutUrl: string;
  isSimulated?: boolean;
}> {
  return await apiFetch<{
    checkoutUrl: string;
    isSimulated?: boolean;
  }>('/payments/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}

export async function fetchOrderById(idOrNumber: string): Promise<OrderRecord> {
  const data = await apiFetch<{ order: OrderRecord }>(`/orders/${idOrNumber}`, {
    cache: 'no-store',
  });
  return data.order;
}
