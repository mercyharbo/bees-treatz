'use client';

import useSWR from 'swr';
import { api, extractErrorMessage } from '@/lib/api';
import { Category, GetMenuResponse, MenuItem, GetMenuItemResponse } from '@/types/menu';
import { useMenuStore } from '@/store/useMenuStore';

const fetchMenuData = async (url: string): Promise<Category[]> => {
  const data = await api.get<GetMenuResponse>(url);
  return data?.categories || [];
};

/**
 * Hook to retrieve the live categorized menu using SWR caching & background revalidation.
 */
export function useMenu() {
  const { data, error, isLoading, mutate } = useSWR('/menu', fetchMenuData, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 60000,
  });

  return {
    categories: data || [],
    isLoading,
    error: error ? extractErrorMessage(error) : null,
    refreshMenu: mutate,
  };
}

/**
 * Hook to retrieve a single menu item by ID or Slug using SWR caching.
 */
export function useMenuItem(idOrSlug: string) {
  const { data, error, isLoading, mutate } = useSWR(
    idOrSlug ? `/menu-details/${idOrSlug}` : null,
    async (url: string): Promise<MenuItem | null> => {
      const res = await api.get<GetMenuItemResponse>(url);
      const item = res?.item || null;
      if (item) {
        useMenuStore.getState().initItemDetails(item);
      }
      return item;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    item: data || null,
    isLoading,
    error: error ? extractErrorMessage(error) : null,
    refreshItem: mutate,
  };
}

