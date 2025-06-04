// Central exports for all shared types
export * from './user';
export * from './onboarding';

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form and validation types
export interface FormState {
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
  isValid: boolean;
}

export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
