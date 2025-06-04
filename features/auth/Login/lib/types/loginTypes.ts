import { ZodError } from 'zod';

// Login form field errors interface
export interface LoginFieldErrors {
  email?: string;
  password?: string;
  general?: string;
}

// Login validation result types
export interface LoginValidationSuccess {
  success: true;
  data: {
    email: string;
    password: string;
  };
}

export interface LoginValidationError {
  success: false;
  error: ZodError;
}

export type LoginValidationResult =
  | LoginValidationSuccess
  | LoginValidationError;

// Login hook props interface
export interface UseLoginFormProps {
  onSuccess?: (isProfileComplete: boolean) => void;
}

// Auth error types
export interface AuthError {
  message: string;
  code?: string;
}
