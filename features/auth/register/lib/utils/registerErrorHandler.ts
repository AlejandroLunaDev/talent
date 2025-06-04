// Mapeo de códigos de error de Supabase en registro a claves de traducción
const REGISTER_ERROR_MESSAGE_MAP: Record<string, string> = {
  'User already registered': 'auth.register.errors.userExists',
  already_registered: 'auth.register.errors.userExists',
  user_already_exists: 'auth.register.errors.userExists',
  'Email address is invalid': 'auth.register.errors.emailInvalid',
  email_address_invalid: 'auth.register.errors.emailInvalid',
  'Password should be at least 6 characters':
    'auth.register.errors.passwordTooShort',
  password_too_short: 'auth.register.errors.passwordTooShort',
  'Invalid email': 'auth.register.errors.emailInvalid',
  invalid_email: 'auth.register.errors.emailInvalid',
  'Weak password': 'auth.register.errors.passwordWeak',
  weak_password: 'auth.register.errors.passwordWeak',
  'Network error': 'auth.register.errors.networkError',
  network_error: 'auth.register.errors.networkError'
};

// Función para convertir errores de Supabase a mensajes localizados para registro
export const mapRegisterError = (error: unknown): string => {
  if (!error) {
    return 'auth.register.errors.general';
  }

  let errorMessage = '';
  let errorCode = '';

  // Extraer mensaje y código del error
  if (error instanceof Error) {
    errorMessage = error.message;
    // Algunos errores de Supabase incluyen el código en un objeto
    if ('code' in error) {
      errorCode = (error as any).code || '';
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    errorMessage = errorObj.message || errorObj.error_description || '';
    errorCode = errorObj.code || errorObj.error || '';
  }

  // Intentar mapear por código primero
  if (errorCode && REGISTER_ERROR_MESSAGE_MAP[errorCode]) {
    return REGISTER_ERROR_MESSAGE_MAP[errorCode];
  }

  // Intentar mapear por mensaje
  if (errorMessage && REGISTER_ERROR_MESSAGE_MAP[errorMessage]) {
    return REGISTER_ERROR_MESSAGE_MAP[errorMessage];
  }

  // Buscar coincidencias parciales en el mensaje
  for (const [key, translationKey] of Object.entries(
    REGISTER_ERROR_MESSAGE_MAP
  )) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return translationKey;
    }
  }

  // Error genérico si no se encuentra mapeo
  return 'auth.register.errors.general';
};

// Función específica para manejar el caso de usuario ya registrado
export const handleUserAlreadyExists = (
  email: string
): {
  errorKey: string;
  shouldShowLoginLink: boolean;
} => {
  return {
    errorKey: 'auth.register.errors.userExistsWithAction',
    shouldShowLoginLink: true
  };
};
