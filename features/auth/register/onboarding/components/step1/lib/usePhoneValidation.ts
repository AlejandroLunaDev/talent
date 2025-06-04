import { useCallback, useEffect } from 'react';
import { Country } from './types';
import { Step1FormData } from '../../../lib/validations/onboardingSchemas';

interface UsePhoneValidationProps {
  phone: string;
  selectedCountry: Country | undefined;
  validateField: (fieldName: keyof Step1FormData, value: any) => void;
}

export function usePhoneValidation({
  phone,
  selectedCountry,
  validateField
}: UsePhoneValidationProps) {
  const validatePhone = useCallback(() => {
    if (phone && selectedCountry?.dial_code) {
      const cleanDialCode = selectedCountry.dial_code.replace(/\D/g, '');
      const fullPhoneNumber = `${cleanDialCode}${phone}`;
      validateField('phone', fullPhoneNumber);
    }
  }, [phone, selectedCountry?.dial_code, validateField]);

  // Run validation when phone or country code changes
  useEffect(() => {
    if (phone && selectedCountry?.dial_code) {
      const timer = setTimeout(() => {
        validatePhone();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [phone, selectedCountry?.dial_code, validatePhone]);

  return { validatePhone };
}
 