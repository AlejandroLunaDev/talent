'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from 'next';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/shared/ui';
import { useOnboardingStore } from '../lib/store/onboardingStore';
import { useSubmitOnboardingStep1 } from '../lib/hooks/useSubmitOnboardingStep1';
import { Step1FormData } from '../lib/validations/onboardingSchemas';
import { useTranslations } from 'next-intl';
import { FieldError } from './step1/lib/types';
import { FirstNameField } from './step1/FirstNameField';
import { LastNameField } from './step1/LastNameField';
import { CountryField } from './step1/CountryField';
import { LanguagePreferenceField } from './step1/LanguagePreferenceField';
import { CityField } from './step1/CityField';
import { PhoneField } from './step1/PhoneField/PhoneField';
import { toast } from 'sonner';

interface OnboardingStep1FormProps {
  onSuccess?: () => void;
}

export function OnboardingStep1Form({ onSuccess }: OnboardingStep1FormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const t = useTranslations('auth.register.onboarding.step1');

  // Estado local para el botón de cambiar cuenta
  const [isChangingAccount, setIsChangingAccount] = useState(false);

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    country,
    setCountry,
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

  // Wrapper para manejar la validación de campos con tipos correctos
  const handleFieldValidation = (fieldName: string, value: string) => {
    // Solo validar si el fieldName es una clave válida del schema
    const validFields = [
      'firstName',
      'lastName',
      'country',
      'city',
      'phone',
      'languagePreference'
    ];
    if (validFields.includes(fieldName)) {
      validateField(fieldName as keyof Step1FormData, value);
    }
  };

  // Manejador especial para el cambio de país que limpia la ciudad
  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    // Limpiar la ciudad cuando cambia el país
    if (city) {
      setCity('');
    }
  };

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

  // Handle logout to change account - mejorado
  const handleChangeAccount = async () => {
    if (isChangingAccount) return; // Prevenir múltiples clicks

    setIsChangingAccount(true);

    try {
      // Hacer signOut y esperar a que se complete
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      // Mostrar mensaje de éxito
      toast.success(t('signOutSuccess') || 'Sesión cerrada correctamente');

      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        router.push('/login' as Route);
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(t('signOutError') || 'Error al cerrar sesión');
      setIsChangingAccount(false); // Reset estado en caso de error
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header with change account option */}
      <div className='flex justify-between items-center pb-4 border-b border-slate-700/30'>
        <div>
          <h3 className='text-lg font-semibold text-slate-100 mb-1'>
            {t('description') || 'Primero, cuéntanos un poco sobre ti'}
          </h3>
          <p className='text-sm text-slate-400'>
            {t('setupProfile') || 'Configura tu perfil para comenzar'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {error && (
          <div className='p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-200 text-sm'>
            {error}
          </div>
        )}

        {/* Nombre y Apellido - lado a lado */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FirstNameField
            value={firstName}
            onChange={setFirstName}
            error={findFieldError('firstName')}
            onValidate={handleFieldValidation}
          />

          <LastNameField
            value={lastName}
            onChange={setLastName}
            error={findFieldError('lastName')}
            onValidate={handleFieldValidation}
          />
        </div>

        <LanguagePreferenceField
          value={languagePreference}
          onChange={setLanguagePreference}
          onValidate={handleFieldValidation}
        />

        {/* País y Ciudad - lado a lado */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <CountryField
            value={country}
            onChange={handleCountryChange}
            error={findFieldError('country')}
            onValidate={handleFieldValidation}
          />

          <CityField
            value={city}
            onChange={setCity}
            error={findFieldError('city')}
            onValidate={handleFieldValidation}
            selectedCountry={country}
          />
        </div>

        <PhoneField
          value={phone}
          onChange={setPhone}
          error={findFieldError('phone')}
          onValidate={handleFieldValidation}
          selectedCountryCode={selectedCountryCode}
          onCountryChange={setSelectedCountryCode}
        />

        <div className='space-y-3'>
          <Button
            type='submit'
            className='w-full bg-gradient-to-r from-[#FF1493] to-[#00BFFF] hover:from-[#FF1493]/90 hover:to-[#00BFFF]/90'
            disabled={
              isLoading ||
              !firstName ||
              !lastName ||
              !country ||
              !city ||
              !phone ||
              !languagePreference ||
              !selectedCountryCode
            }
          >
            {isLoading ? t('saving') : t('continue')}
          </Button>

          {/* Alternative actions - mejorado */}
          <div className='text-center'>
            <button
              type='button'
              onClick={handleChangeAccount}
              disabled={isChangingAccount || isLoading}
              className='text-xs text-slate-500 hover:text-slate-400 transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isChangingAccount
                ? 'Cerrando sesión...'
                : t('wrongAccount') || '¿No es tu cuenta? Cambiar cuenta'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
