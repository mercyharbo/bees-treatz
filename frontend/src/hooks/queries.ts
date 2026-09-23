'use client';

import useSWR, { SWRConfiguration } from 'swr';
import { apiFetch, extractErrorMessage } from '@/lib/api';
import {
  Category,
  MenuItem,
  OrderRecord,
  AdminUser,
  HealthResponse,
  GetMenuResponse,
  GetMenuItemResponse,
  GetOrderResponse,
  GetAllOrdersResponse,
  QueryResult,
} from '@/types';

export type { QueryResult };

/**
 * Generic reusable SWR GET hook for any endpoint.
 *
 * @example
 * const { data, error, loading } = useGet<Category[]>('/menu');
 */
export function useGet<T = unknown, D = T>(
  endpoint: string | null | undefined,
  options?: SWRConfiguration,
  transform?: (data: T) => D
): QueryResult<T, D> {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(
    endpoint || null,
    (url: string) => apiFetch<T>(url),
    options
  );

  return {
    data: data ? (transform ? transform(data) : (data as unknown as D)) : undefined,
    error: error ? extractErrorMessage(error) : null,
    rawError: error,
    loading: isLoading,
    isValidating,
    mutate,
  };
}

/**
 * Hook for fetching menu categories and items.
 *
 * @example
 * const { menu, error, loading } = useMenu();
 */
export function useMenu(options?: SWRConfiguration) {
  const result = useGet<GetMenuResponse, Category[]>(
    '/menu',
    options,
    (res) => res.categories || []
  );

  return {
    menu: result.data,
    categories: result.data,
    ...result,
  };
}

/**
 * Hook for fetching a single menu item by ID.
 *
 * @example
 * const { item, error, loading } = useMenuItem('item-id-123');
 */
export function useMenuItem(id: string | null | undefined, options?: SWRConfiguration) {
  const result = useGet<GetMenuItemResponse, MenuItem>(
    id ? `/menu/${id}` : null,
    options,
    (res) => res.item
  );

  return {
    item: result.data,
    ...result,
  };
}

/**
 * Hook for fetching an order by order ID or order number.
 * Can be configured with `refreshInterval` for polling live order status.
 *
 * @example
 * const { order, error, loading } = useOrder(orderId, { refreshInterval: 5000 });
 */
export function useOrder(
  idOrNumber: string | null | undefined,
  options?: SWRConfiguration
) {
  const result = useGet<GetOrderResponse, OrderRecord>(
    idOrNumber ? `/orders/${idOrNumber}` : null,
    options,
    (res) => res.order
  );

  return {
    order: result.data,
    ...result,
  };
}

/**
 * Hook for fetching all orders (Admin).
 *
 * @example
 * const { orders, error, loading } = useAdminOrders();
 */
export function useAdminOrders(options?: SWRConfiguration) {
  const result = useGet<GetAllOrdersResponse, OrderRecord[]>(
    '/orders',
    options,
    (res) => res.orders || []
  );

  return {
    orders: result.data,
    ...result,
  };
}

/**
 * Hook for fetching current authenticated admin profile.
 *
 * @example
 * const { admin, error, loading } = useAdminMe();
 */
export function useAdminMe(options?: SWRConfiguration) {
  const result = useGet<{ success: boolean; user: AdminUser }, AdminUser>(
    '/auth/me',
    options,
    (res) => res.user
  );

  return {
    admin: result.data,
    ...result,
  };
}

/**
 * Hook for fetching API health check status.
 *
 * @example
 * const { health, error, loading } = useHealth();
 */
export function useHealth(options?: SWRConfiguration) {
  const result = useGet<HealthResponse>('/health', options);

  return {
    health: result.data,
    ...result,
  };
}
