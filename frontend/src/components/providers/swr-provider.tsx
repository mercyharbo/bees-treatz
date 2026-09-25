'use client';

import React, { useEffect } from 'react';
import { SWRConfig } from 'swr';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

interface SWRProviderProps {
  children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => apiFetch(url),
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
