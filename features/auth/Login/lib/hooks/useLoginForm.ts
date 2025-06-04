import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useTranslations } from 'next-intl';
import {
  validateLogin,
  emailSchema,
  passwordSchema
} from '../validations/loginSchemas';
import { LoginFieldErrors, UseLoginFormProps } from '../types/loginTypes';
import { mapAuthError } from '../utils/authErrorHandler';
import { checkProfileCompleteness } from '../../../lib/utils/dev-config';

// Estado inicial por defecto para los errores
const initialFieldErrors: LoginFieldErrors = {
  email: undefined,
  password: undefined,
  general: undefined
};

export const useLoginForm = ({ onSuccess }: UseLoginFormProps = {}) => {
  const supabase = createClientComponentClient();
  const t = useTranslations();

  // Form state con inicialización más robusta
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] =
    useState<LoginFieldErrors>(initialFieldErrors);

  // Validar campo específico (solo para onBlur)
  const validateField = useCallback(
    (fieldName: 'email' | 'password', value: string) => {
      try {
        if (fieldName === 'email') {
          emailSchema.parse(value);
          setFieldErrors(prev => ({ ...prev, email: undefined }));
        } else if (fieldName === 'password') {
          passwordSchema.parse(value);
          setFieldErrors(prev => ({ ...prev, password: undefined }));
        }
      } catch (error: any) {
        const errorMessage = error.errors?.[0]?.message;
        if (errorMessage) {
          setFieldErrors(prev => ({
            ...prev,
            [fieldName]: t(`auth.login.${errorMessage}`)
          }));
        }
      }
    },
    [t]
  );

  // Solo limpiar errores cuando el usuario empieza a escribir (NO validar)
  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      // Solo limpiar errores existentes, NO validar aún
      if (fieldErrors?.email) {
        setFieldErrors(prev => ({ ...prev, email: undefined }));
      }
      if (fieldErrors?.general) {
        setFieldErrors(prev => ({ ...prev, general: undefined }));
      }
    },
    [fieldErrors?.email, fieldErrors?.general]
  );

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      // Solo limpiar errores existentes, NO validar aún
      if (fieldErrors?.password) {
        setFieldErrors(prev => ({ ...prev, password: undefined }));
      }
      if (fieldErrors?.general) {
        setFieldErrors(prev => ({ ...prev, general: undefined }));
      }
    },
    [fieldErrors?.password, fieldErrors?.general]
  );

  // Validar solo cuando pierde el foco (onBlur)
  const validateEmailField = useCallback(
    (emailValue: string) => {
      // Solo validar si el campo no está vacío
      if (emailValue.trim()) {
        validateField('email', emailValue);
      }
    },
    [validateField]
  );

  const validatePasswordField = useCallback(
    (passwordValue: string) => {
      // Solo validar si el campo no está vacío
      if (passwordValue.trim()) {
        validateField('password', passwordValue);
      }
    },
    [validateField]
  );

  // Handle form submission with validation
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Reset general error
      setFieldErrors(prev => ({ ...prev, general: undefined }));

      // Validate form data
      const validationResult = validateLogin({ email, password });

      if (!validationResult.success) {
        const newErrors: LoginFieldErrors = { ...initialFieldErrors };

        validationResult.error.errors.forEach(error => {
          const field = error.path[0] as keyof LoginFieldErrors;
          if (field && field !== 'general') {
            newErrors[field] = t(`auth.login.${error.message}`);
          }
        });

        setFieldErrors(newErrors);
        return;
      }

      setIsLoading(true);

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: validationResult.data.email,
          password: validationResult.data.password
        });

        if (error) throw error;

        if (data.user) {
          const isProfileComplete = await checkProfileCompleteness(
            data.user.id
          );
          toast.success(t('auth.login.success'));
          onSuccess?.(isProfileComplete);
        }
      } catch (err) {
        const errorKey = mapAuthError(err);
        const errorMessage = t(errorKey);
        setFieldErrors({ ...initialFieldErrors, general: errorMessage });
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, t, supabase, onSuccess]
  );

  // Handle Google login
  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    setFieldErrors(initialFieldErrors);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`
        }
      });

      if (error) throw error;

      // Note: For OAuth, the user will be redirected to callback
      // The callback should handle checking profile completeness
    } catch (err) {
      const errorKey = mapAuthError(err);
      const errorMessage = t(errorKey);
      setFieldErrors({ ...initialFieldErrors, general: errorMessage });
      toast.error(errorMessage);
      setIsLoading(false);
    }
  }, [supabase, t]);

  return {
    // Form data
    email,
    password,
    isLoading,
    fieldErrors: fieldErrors || initialFieldErrors, // Fallback adicional

    // Handlers
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    handleGoogleLogin,

    // Validation helpers (solo para onBlur)
    validateEmailField,
    validatePasswordField
  };
};
