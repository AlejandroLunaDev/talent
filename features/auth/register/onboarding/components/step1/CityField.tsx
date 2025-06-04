'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/shared/ui';
import { Step1FieldProps } from './lib/types';

interface CityFieldProps extends Step1FieldProps {
  value: string;
  onChange: (value: string) => void;
  selectedCountry: string;
}

export function CityField({
  value,
  onChange,
  error,
  onValidate,
  selectedCountry
}: CityFieldProps) {
  const t = useTranslations('auth.register.onboarding.step1');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    onValidate?.('city', value);
  };

  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium text-slate-200'>
        {t('city') || 'Ciudad'}
      </label>
      <Input
        type='text'
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={t('selectCity') || 'Ingresa tu ciudad'}
        disabled={!selectedCountry}
        className={`bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        }`}
      />
      {!selectedCountry && (
        <p className='text-xs text-slate-500'>
          {t('selectCountryFirst') || 'Selecciona país'}
        </p>
      )}
      {error && (
        <p className='text-sm text-red-400 flex items-center gap-1'>
          <span className='text-red-400'>⚠</span>
          {t(error.message) || error.message}
        </p>
      )}
    </div>
  );
}
