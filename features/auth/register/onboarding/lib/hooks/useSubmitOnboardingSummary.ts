import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useOnboardingStore } from '../store/onboardingStore';
import { useState, useEffect } from 'react';

interface UseSubmitOnboardingSummaryProps {
  onSuccess?: () => void;
}

export const useSubmitOnboardingSummary = ({
  onSuccess
}: UseSubmitOnboardingSummaryProps = {}) => {
  const router = useRouter();
  const {
    firstName,
    lastName,
    languagePreference,
    city,
    phone,
    role,
    seniority,
    skills,
    tools,
    goals,
    setIsLoading,
    setError,
    reset,
    isLoading
  } = useOnboardingStore();

  const fullName = `${firstName} ${lastName}`.trim();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation of collected data before submitting
    if (
      !fullName ||
      !languagePreference ||
      !city ||
      !phone ||
      !role ||
      !seniority ||
      !skills ||
      !tools ||
      Object.values(goals).every(goal => !goal)
    ) {
      setError('Please complete all steps before submitting.');
      toast.error('Por favor, completa todos los pasos del registro.');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate successful registration completion
      console.log('Onboarding data collected:', {
        fullName,
        languagePreference,
        city,
        phone,
        role,
        seniority,
        skills,
        tools,
        goals: Object.keys(goals).filter(key => goals[key])
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Onboarding complete!');
      toast.success('¡Registro completado exitosamente!');

      // Reset store state
      reset();

      // Call the onSuccess callback
      onSuccess?.();
    } catch (err) {
      console.error('Error during onboarding summary submit:', err);
      setError(
        err instanceof Error ? err.message : 'Error al completar el registro.'
      );
      toast.error(
        err instanceof Error ? err.message : 'Error al completar el registro.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Return simplified interface without authToken dependency
  return { handleSubmit, isLoading, authToken: 'mock-token' };
};
