import { AuthError } from '../types/loginTypes';

// Mapeo de códigos de error de Supabase a claves de traducción
const ERROR_MESSAGE_MAP: Record<string, string> = {
  'Invalid login credentials': 'auth.login.errors.invalidCredentials',
  invalid_credentials: 'auth.login.errors.invalidCredentials',
  'Email not confirmed': 'auth.login.errors.emailNotConfirmed',
  email_not_confirmed: 'auth.login.errors.emailNotConfirmed',
  'Too many requests': 'auth.login.errors.tooManyAttempts',
  rate_limit_exceeded: 'auth.login.errors.tooManyAttempts',
  'User not found': 'auth.login.errors.userNotFound',
  user_not_found: 'auth.login.errors.userNotFound',
  'Network error': 'auth.login.errors.networkError',
  network_error: 'auth.login.errors.networkError'
};

// Función para convertir errores de Supabase a mensajes localizados
export const mapAuthError = (error: unknown): string => {
  if (!error) {
    return 'auth.login.errors.general';
  }

  let errorMessage = '';
  let errorCode = '';

  // Extraer mensaje y código del error
  if (error instanceof Error) {
    errorMessage = error.message;
    // Algunos errores de Supabase incluyen el código en un objeto
    if ('code' in error) {
      errorCode = (error as AuthError).code || '';
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    errorMessage = errorObj.message || errorObj.error_description || '';
    errorCode = errorObj.code || errorObj.error || '';
  }

  // Intentar mapear por código primero
  if (errorCode && ERROR_MESSAGE_MAP[errorCode]) {
    return ERROR_MESSAGE_MAP[errorCode];
  }

  // Intentar mapear por mensaje
  if (errorMessage && ERROR_MESSAGE_MAP[errorMessage]) {
    return ERROR_MESSAGE_MAP[errorMessage];
  }

  // Buscar coincidencias parciales en el mensaje
  for (const [key, translationKey] of Object.entries(ERROR_MESSAGE_MAP)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return translationKey;
    }
  }

  // Error genérico si no se encuentra mapeo
  return 'auth.login.errors.general';
};

// Función para validar si un email tiene formato válido (validación adicional)
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar fortaleza de contraseña (validación adicional)
export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8;
};
