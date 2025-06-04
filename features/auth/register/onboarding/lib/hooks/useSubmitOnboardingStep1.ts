import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useOnboardingStore } from '../store/onboardingStore';
import { useState } from 'react';
import {
  validateStep1,
  step1Schema,
  Step1FormData
} from '../validations/onboardingSchemas';
import { z } from 'zod';

interface UseSubmitOnboardingStep1Props {
  onSuccess?: () => void;
}

export const useSubmitOnboardingStep1 = ({
  onSuccess
}: UseSubmitOnboardingStep1Props = {}) => {
  const router = useRouter();
  const {
    firstName,
    lastName,
    country,
    city,
    phone,
    languagePreference,
    setIsLoading,
    setError,
    isLoading
  } = useOnboardingStore();

  const [fieldErrors, setFieldErrors] = useState<z.ZodIssue[] | null>(null);

  // Function to validate a specific field
  const validateField = (fieldName: keyof Step1FormData, value: any) => {
    // Create an object with current form values
    const currentFormData: Step1FormData = {
      firstName: firstName,
      lastName: lastName,
      country: country,
      city: city,
      phone: phone,
      languagePreference: languagePreference
    };
    // Update the value for the specific field being validated
    (currentFormData[fieldName] as any) = value; // Type assertion needed for dynamic assignment

    try {
      // Validate the entire schema with the updated field value
      step1Schema.parse(currentFormData);
      // If successful, remove any existing error for this field
      setFieldErrors(prevErrors =>
        prevErrors
          ? prevErrors.filter(err => !err.path.includes(fieldName))
          : null
      );
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Find the error specific to this field
        const fieldErr = err.errors.find(e => e.path.includes(fieldName));
        if (fieldErr) {
          // Add or update the error for this field
          setFieldErrors(prevErrors => {
            const filtered = prevErrors
              ? prevErrors.filter(e => !e.path.includes(fieldName))
              : [];
            return [...filtered, fieldErr];
          });
        } else {
          // If no specific error for this field but overall validation failed (shouldn't happen often with field-specific focus)
          setFieldErrors(prevErrors =>
            prevErrors
              ? prevErrors.filter(e => !e.path.includes(fieldName))
              : null
          ); // Clear error if it somehow disappeared
        }
      } else {
        // Handle other potential errors, though unlikely in field validation
        console.error(`Error validating field ${fieldName}:`, err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors(null);

    try {
      const result = validateStep1({
        firstName,
        lastName,
        country,
        city,
        phone,
        languagePreference
      });

      if (!result.success) {
        setFieldErrors(result.error.errors);
        toast.error('Por favor, corrige los errores en el formulario.');
        return;
      }

      console.log('Onboarding step 1 validation successful');
      onSuccess?.();
    } catch (err) {
      console.error('Error during onboarding Step 1 processing:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Error al procesar el formulario de Información Personal.'
      );
      toast.error(
        err instanceof Error
          ? err.message
          : 'Error al validar información personal'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, fieldErrors, validateField };
};
