import { KeyedMutator } from 'swr';

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message?: string;
  status?: number;
  errors?: string[];
}

export interface QueryResult<T, D = T> {
  data: D | undefined;
  error: string | null;
  rawError: unknown;
  loading: boolean;
  isValidating: boolean;
  mutate: KeyedMutator<T>;
}
