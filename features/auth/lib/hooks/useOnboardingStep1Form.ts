import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Route } from 'next';

interface UseOnboardingStep1FormResult {
  fullName: string;
  setFullName: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  languagePreference: string;
  setLanguagePreference: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useOnboardingStep1Form = (): UseOnboardingStep1FormResult => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [languagePreference, setLanguagePreference] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to hold the token needed for the API call
  const [tempToken, setTempToken] = useState<string | null>(null);

  // Effect to get the token on component mount
  useEffect(() => {
    let token = localStorage.getItem('tempToken');
    if (!token) {
      token = localStorage.getItem('auth_token'); // Fallback for Google auth
    }

    if (!token || token.length < 20) {
      // Basic token validation
      console.error('No valid token found in localStorage');
      toast.error('No se encontró información de autenticación válida');
      // router.push('/login'); // Redirect to login if no valid token - uncomment if necessary
      return;
    }
    setTempToken(token);

    // Clean up localStorage tokens after retrieval if they are temp
    // Note: Decide carefully if and when to clear these tokens.
    // localStorage.removeItem('tempToken');
    // localStorage.removeItem('auth_token');
  }, []); // Run only once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Ensure token is available before proceeding
    if (!tempToken) {
      setError('Authentication token missing.');
      toast.error('Información de autenticación faltante.');
      setIsLoading(false);
      return;
    }

    // Basic form validation before sending (can be enhanced with Zod if needed)
    if (!fullName || !city || !phone || !languagePreference) {
      setError('Please fill in all required fields.');
      toast.error('Por favor, completa todos los campos requeridos.');
      setIsLoading(false);
      return;
    }

    try {
      // Obtener el país y timezone del localStorage (assuming they were set during auth flow)
      const userCountry = localStorage.getItem('user_country');
      const userTimezone = localStorage.getItem('user_timezone');

      if (!userCountry || !userTimezone) {
        // Handle case where country or timezone is missing
        console.error('Country or timezone missing from localStorage');
        setError('Missing location or timezone information.');
        toast.error('Información de ubicación o zona horaria faltante.');
        setIsLoading(false);
        // router.push('/login'); // Redirect if essential info is missing
        return;
      }

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const endpoint = `${apiBaseUrl}/api/auth/register/step2`;

      console.log('Sending onboarding data:', {
        fullName,
        userCountry,
        city,
        phone,
        userTimezone,
        languagePreference
      });
      console.log('Using token (partial):', tempToken.substring(0, 10) + '...');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tempToken}` // Use the token here
        },
        body: JSON.stringify({
          fullName,
          country: userCountry, // Use country from localStorage
          city,
          phone,
          timezone: userTimezone, // Use timezone from localStorage
          languagePreference
        })
      });

      if (!response.ok) {
        const errorData = await response.json(); // Assuming backend sends JSON error responses
        console.error('Backend error:', errorData);
        throw new Error(
          errorData.message || 'Error al guardar información personal'
        );
      }

      console.log('✅ Step 1 completed successfully!');
      setIsLoading(false);
      router.push('/onboarding/professional' as Route);
    } catch (err) {
      console.error('Error during onboarding submit:', err);
      setError(
        err instanceof Error ? err.message : 'Error al procesar el formulario.'
      );
      toast.error(
        err instanceof Error
          ? err.message
          : 'Error al guardar información personal'
      );
    }
  };

  return {
    fullName,
    setFullName,
    city,
    setCity,
    phone,
    setPhone,
    languagePreference,
    setLanguagePreference,
    isLoading,
    error,
    handleSubmit
  };
};
