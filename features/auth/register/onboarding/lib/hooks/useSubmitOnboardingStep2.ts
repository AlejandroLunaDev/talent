import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useOnboardingStore } from '../store/onboardingStore';
import { useState } from 'react';
import {
  validateStep2,
  step2Schema,
  Step2FormData
} from '../validations/onboardingSchemas';
import { z } from 'zod';

interface UseSubmitOnboardingStep2Props {
  onSuccess?: () => void;
}

export const useSubmitOnboardingStep2 = ({
  onSuccess
}: UseSubmitOnboardingStep2Props = {}) => {
  const router = useRouter();
  const {
    role,
    seniority,
    skills,
    tools,
    goals,
    setIsLoading,
    setError,
    isLoading
  } = useOnboardingStore();

  const [fieldErrors, setFieldErrors] = useState<z.ZodIssue[] | null>(null);

  // Function to validate a specific field
  const validateField = (fieldName: keyof Step2FormData, value: any) => {
    // Create an object with current form values
    const currentFormData: Step2FormData = {
      role: role as any,
      seniority: seniority as any,
      skills: skills,
      tools: tools,
      goals: goals as any
    };
    // Update the value for the specific field being validated
    (currentFormData[fieldName] as any) = value;

    try {
      // Validate the entire schema with the updated field value
      step2Schema.parse(currentFormData);
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
          // Clear error if validation passes for this field
          setFieldErrors(prevErrors =>
            prevErrors
              ? prevErrors.filter(e => !e.path.includes(fieldName))
              : null
          );
        }
      } else {
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
      const result = validateStep2({
        role,
        seniority,
        skills,
        tools,
        goals
      });

      if (!result.success) {
        setFieldErrors(result.error.errors);
        toast.error('Por favor, corrige los errores en el formulario.');
        return;
      }

      console.log('Onboarding step 2 validation successful');
      onSuccess?.();
    } catch (err) {
      console.error('Error during onboarding Step 2 processing:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Error al procesar el formulario de Información Profesional.'
      );
      toast.error(
        err instanceof Error
          ? err.message
          : 'Error al validar información profesional'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, fieldErrors, validateField };
};

// Add onSuccess to the hook signature if it's not there
// This requires reading the file first to check the current signature.
// Based on the pattern of useSubmitOnboardingStep1, it should have an onSuccess prop.
// I will make sure the hook signature is correct in a follow-up edit if necessary after reading the file.
