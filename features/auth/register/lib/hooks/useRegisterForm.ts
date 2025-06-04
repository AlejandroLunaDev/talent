import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { createRegisterSchema } from '../validations/registerValidation';
import type { RegisterFormData } from '../../types';

interface UseRegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

export function useRegisterForm({ onSubmit, isLoading }: UseRegisterFormProps) {
  const t = useTranslations('auth.register');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Memoize schema to prevent infinite loops
  const schema = useMemo(() => createRegisterSchema(t), [t]);

  // Validate a specific field
  const validateField = useCallback(
    (field: string, value: string) => {
      try {
        if (field === 'email') {
          schema.shape.email.parse(value);
        } else if (field === 'password') {
          schema.shape.password.parse(value);
        } else if (field === 'confirmPassword') {
          // For confirm password, we need to check the whole object
          const testData = { ...formData, confirmPassword: value };
          schema.parse(testData);
        }
        return null; // No error
      } catch (error: any) {
        return error.errors?.[0]?.message || 'Invalid value';
      }
    },
    [schema, formData]
  );

  // Real-time validation for form completeness (but only show errors for touched fields)
  useEffect(() => {
    const result = schema.safeParse(formData);
    setIsFormValid(result.success);

    // Only show errors for fields that have been touched
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(error => {
        const field = error.path[0] as string;
        if (touchedFields[field]) {
          fieldErrors[field] = error.message;
        }
      });
      setErrors(fieldErrors);
    } else {
      // Clear errors if form is valid
      setErrors({});
    }
  }, [formData, schema, touchedFields]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched on submit
    setTouchedFields({
      email: true,
      password: true,
      confirmPassword: true
    });

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(error => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is managed by parent component
    }
  };

  return {
    formData,
    errors,
    showPassword,
    isFormValid,
    touchedFields,
    setShowPassword,
    updateField,
    handleFieldBlur,
    handleSubmit
  };
}
