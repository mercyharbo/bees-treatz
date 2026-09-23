'use client';

import { useState, useCallback } from 'react';
import { apiFetch, extractErrorMessage } from '@/lib/api';

export type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface MutationOptions<TData = unknown, TBody = unknown> {
  endpoint?: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  onSuccess?: (data: TData) => void;
  onError?: (error: string, rawError: unknown) => void;
}

export interface UseMutationReturn<TData = unknown, TBody = unknown> {
  /** Reactive state tracking whether the request is in flight */
  loading: boolean;
  isMutating: boolean;
  /** Human-readable error string extracted from backend */
  error: string | null;
  /** Raw error object from fetch/backend */
  rawError: unknown;
  /** Response data returned from the backend */
  data: TData | undefined;
  /** Reset error, data, and loading state */
  reset: () => void;
  /** Generic trigger method */
  trigger: (body?: TBody, callOptions?: MutationOptions<TData, TBody>) => Promise<TData>;
  /** Send POST request */
  post: (body?: TBody, callOptions?: MutationOptions<TData, TBody>) => Promise<TData>;
  /** Send PUT request */
  put: (body?: TBody, callOptions?: MutationOptions<TData, TBody>) => Promise<TData>;
  /** Send PATCH request */
  patch: (body?: TBody, callOptions?: MutationOptions<TData, TBody>) => Promise<TData>;
  /** Send DELETE request */
  del: (body?: TBody, callOptions?: MutationOptions<TData, TBody>) => Promise<TData>;
}

/**
 * Reusable hook for performing POST, PUT, PATCH, and DELETE requests seamlessly
 * with robust backend error extraction and reactive loading/error states.
 *
 * @param defaultEndpoint Optional default endpoint (e.g. '/orders' or '/delivery/validate-postcode')
 * @param defaultOptions Optional default configuration
 *
 * @example
 * const { post, loading, error } = useMutation('/orders');
 * await post({ customerName: 'John', items: [...] });
 *
 * @example
 * const { trigger, loading, error } = useMutation();
 * await trigger(payload, { endpoint: '/delivery/validate-postcode', method: 'POST' });
 */
export function useMutation<TData = unknown, TBody = unknown>(
  defaultEndpoint?: string,
  defaultOptions?: MutationOptions<TData, TBody>
): UseMutationReturn<TData, TBody> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<unknown>(null);
  const [data, setData] = useState<TData | undefined>(undefined);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setRawError(null);
    setData(undefined);
  }, []);

  const trigger = useCallback(
    async (
      body?: TBody,
      callOptions?: MutationOptions<TData, TBody>
    ): Promise<TData> => {
      const endpoint = callOptions?.endpoint || defaultEndpoint;
      if (!endpoint) {
        throw new Error('Endpoint must be provided to useMutation or trigger');
      }

      const method = (callOptions?.method || defaultOptions?.method || 'POST') as HttpMethod;
      const headers = {
        ...(defaultOptions?.headers || {}),
        ...(callOptions?.headers || {}),
      };

      setLoading(true);
      setError(null);
      setRawError(null);

      try {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        const requestBody = isFormData
          ? (body as unknown as FormData)
          : body !== undefined
          ? JSON.stringify(body)
          : undefined;

        const result = await apiFetch<TData>(endpoint, {
          method,
          headers,
          body: requestBody,
        });

        setData(result);
        setLoading(false);

        if (callOptions?.onSuccess) {
          callOptions.onSuccess(result);
        } else if (defaultOptions?.onSuccess) {
          defaultOptions.onSuccess(result);
        }

        return result;
      } catch (err: unknown) {
        const parsedMessage = extractErrorMessage(err, 'Failed to complete request');
        setError(parsedMessage);
        setRawError(err);
        setLoading(false);

        if (callOptions?.onError) {
          callOptions.onError(parsedMessage, err);
        } else if (defaultOptions?.onError) {
          defaultOptions.onError(parsedMessage, err);
        }

        throw err;
      }
    },
    [defaultEndpoint, defaultOptions]
  );

  const post = useCallback(
    (body?: TBody, callOptions?: MutationOptions<TData, TBody>) =>
      trigger(body, { ...callOptions, method: 'POST' }),
    [trigger]
  );

  const put = useCallback(
    (body?: TBody, callOptions?: MutationOptions<TData, TBody>) =>
      trigger(body, { ...callOptions, method: 'PUT' }),
    [trigger]
  );

  const patch = useCallback(
    (body?: TBody, callOptions?: MutationOptions<TData, TBody>) =>
      trigger(body, { ...callOptions, method: 'PATCH' }),
    [trigger]
  );

  const del = useCallback(
    (body?: TBody, callOptions?: MutationOptions<TData, TBody>) =>
      trigger(body, { ...callOptions, method: 'DELETE' }),
    [trigger]
  );

  return {
    loading,
    isMutating: loading,
    error,
    rawError,
    data,
    reset,
    trigger,
    post,
    put,
    patch,
    del,
  };
}
