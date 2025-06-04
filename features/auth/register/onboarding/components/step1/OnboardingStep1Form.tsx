'use client';

import { useCallback } from 'react';
import { Button } from '@/shared/ui';
import { useOnboardingStore } from '../../lib/store/onboardingStore';
import { useSubmitOnboardingStep1 } from '../../lib/hooks/useSubmitOnboardingStep1';
import { useTranslations } from 'next-intl';
import { FieldError } from './lib/types';
import { FullNameField } from './FullNameField';
import { LanguagePreferenceField } from './LanguagePreferenceField';
import { CityField } from './CityField';
import { PhoneField } from './PhoneField/PhoneField';

interface OnboardingStep1FormProps {
  onSuccess?: () => void;
}

export function OnboardingStep1Form({ onSuccess }: OnboardingStep1FormProps) {
  const t = useTranslations('auth.register.onboarding.step1');

  const {
    firstName,
    lastName,
    setFirstName,
    setLastName,
    city,
    setCity,
    phone,
    setPhone,
    languagePreference,
    setLanguagePreference,
    isLoading,
    error,
    selectedCountryCode,
    setSelectedCountryCode
  } = useOnboardingStore();

  const { handleSubmit, fieldErrors, validateField } = useSubmitOnboardingStep1(
    { onSuccess }
  );

  // Helper to find field errors
  const findFieldError = useCallback(
    (fieldName: string): FieldError | undefined =>
      fieldErrors?.find(
        err =>
          err.path.some(p => typeof p === 'string' && p === fieldName) ||
          (fieldName === 'phone' &&
            err.path.length === 1 &&
            err.path[0] === 'phone')
      ),
    [fieldErrors]
  );

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className='p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-200 text-sm'>
          {error}
        </div>
      )}

      <FullNameField
        value={fullName}
        onChange={value => {
          const names = value.split(' ');
          setFirstName(names[0] || '');
          setLastName(names.slice(1).join(' ') || '');
        }}
        error={findFieldError('firstName') || findFieldError('lastName')}
        onValidate={validateField}
      />

      <LanguagePreferenceField
        value={languagePreference}
        onChange={setLanguagePreference}
        onValidate={validateField}
      />

      <CityField
        value={city}
        onChange={setCity}
        error={findFieldError('city')}
        onValidate={validateField}
      />

      <PhoneField
        value={phone}
        onChange={setPhone}
        error={findFieldError('phone')}
        onValidate={validateField}
        selectedCountryCode={selectedCountryCode}
        onCountryChange={setSelectedCountryCode}
      />

      <Button
        type='submit'
        className='w-full bg-gradient-to-r from-[#FF1493] to-[#00BFFF] hover:from-[#FF1493]/90 hover:to-[#00BFFF]/90'
        disabled={
          isLoading ||
          !firstName ||
          !lastName ||
          !city ||
          !phone ||
          !languagePreference ||
          !selectedCountryCode
        }
      >
        {isLoading ? t('saving') : t('continue')}
      </Button>
    </form>
  );
}
