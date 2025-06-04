import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  validateForgotPassword,
  type ForgotPasswordFormData
} from '../validations/passwordRecoverySchemas';
import { passwordRecoveryService } from '../services/passwordRecoveryService';

interface UseForgotPasswordProps {
  onSuccess?: () => void;
}

export const useForgotPassword = ({
  onSuccess
}: UseForgotPasswordProps = {}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<z.ZodIssue[] | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Validate email field on blur
  const validateField = (
    fieldName: keyof ForgotPasswordFormData,
    value: string
  ) => {
    try {
      validateForgotPassword({ [fieldName]: value });
      // Clear error if validation passes
      setFieldErrors(prevErrors =>
        prevErrors
          ? prevErrors.filter(err => !err.path.includes(fieldName))
          : null
      );
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldError = err.errors.find(e => e.path.includes(fieldName));
        if (fieldError) {
          setFieldErrors(prevErrors => {
            const filtered = prevErrors
              ? prevErrors.filter(e => !e.path.includes(fieldName))
              : [];
            return [...filtered, fieldError];
          });
        }
      }
    }
  };

  // Find error for specific field
  const findFieldError = (fieldName: string) =>
    fieldErrors?.find(err =>
      err.path.some(p => typeof p === 'string' && p === fieldName)
    );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError(null);
    setFieldErrors(null);

    try {
      // Validate form data
      const result = validateForgotPassword({ email });

      if (!result.success) {
        setFieldErrors(result.error.errors);
        toast.error('Por favor, corrige los errores en el formulario.');
        return;
      }

      // Send recovery email
      const recoveryResult = await passwordRecoveryService.sendRecoveryEmail(
        result.data
      );

      if (!recoveryResult.success) {
        setGeneralError(recoveryResult.error || 'recovery.error.general');
        toast.error('Error al enviar el correo de recuperación.');
        return;
      }

      // Success
      setIsEmailSent(true);
      toast.success('Correo de recuperación enviado exitosamente.');
      onSuccess?.();
    } catch (error) {
      console.error('Error in forgot password flow:', error);
      setGeneralError('recovery.error.general');
      toast.error('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setEmail('');
    setFieldErrors(null);
    setGeneralError(null);
    setIsEmailSent(false);
  };

  return {
    // Form state
    email,
    setEmail,
    isLoading,
    fieldErrors,
    generalError,
    isEmailSent,

    // Form methods
    handleSubmit,
    validateField,
    findFieldError,
    resetForm
  };
};
