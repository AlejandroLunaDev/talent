import { useState } from 'react';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useTranslations } from 'next-intl';
import { checkProfileCompleteness } from '../utils/dev-config';
import {
  mapRegisterError,
  handleUserAlreadyExists
} from '../../register/lib/utils/registerErrorHandler';

interface UseAuthFormProps {
  onSuccess?: (isProfileComplete: boolean) => void;
}

export const useAuthForm = ({ onSuccess }: UseAuthFormProps = {}) => {
  const supabase = createClientComponentClient();
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginLink, setShowLoginLink] = useState(false);

  const handleEmailLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const isProfileComplete = await checkProfileCompleteness(data.user.id);
        toast.success(t('auth.login.success'));
        onSuccess?.(isProfileComplete);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      toast.error(
        'Error al iniciar sesión. Por favor verifica tus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setShowLoginLink(false);

    try {
      console.log('Attempting to register with:', { email, password: '***' });

      // Try to register the user
      const { data: registerData, error: registerError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

      if (registerError) {
        // Handle specific error cases
        const errorKey = mapRegisterError(registerError);

        // Check if user already exists
        if (
          errorKey === 'auth.register.errors.userExists' ||
          errorKey === 'auth.register.errors.userExistsWithAction'
        ) {
          const userExistsResult = handleUserAlreadyExists(email);
          setShowLoginLink(userExistsResult.shouldShowLoginLink);
          const errorMessage = t(userExistsResult.errorKey);
          setError(errorMessage);
          toast.error(errorMessage);
          return;
        }

        // Handle other registration errors
        const errorMessage = t(errorKey);
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Registration successful
      if (registerData.user) {
        if (registerData.session) {
          // User is automatically logged in after registration
          const isProfileComplete = await checkProfileCompleteness(
            registerData.user.id
          );
          toast.success(t('auth.register.success') || '¡Registro exitoso!');
          onSuccess?.(isProfileComplete); // Will be false for new users
        } else {
          // Email confirmation required
          toast.success(
            t('auth.register.emailConfirmation') ||
              '¡Registro exitoso! Por favor confirma tu email para continuar.'
          );
          // You might want to redirect to a "check your email" page
        }
      }
    } catch (err) {
      const errorKey = mapRegisterError(err);
      const errorMessage = t(errorKey);
      console.error('Registration error:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

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
      setError(
        err instanceof Error
          ? err.message
          : 'Error al iniciar sesión con Google'
      );
      toast.error('Error al iniciar sesión con Google.');
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    showLoginLink,
    handleEmailLogin,
    handleRegister,
    handleGoogleLogin
  };
};
