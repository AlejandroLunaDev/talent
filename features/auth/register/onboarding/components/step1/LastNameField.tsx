'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/shared/ui';
import { FieldError } from './lib/types';

interface LastNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: FieldError;
  onValidate?: (field: string, value: string) => void;
}

export function LastNameField({
  value,
  onChange,
  error,
  onValidate
}: LastNameFieldProps) {
  const t = useTranslations('auth.register.onboarding.step1');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    onValidate?.('lastName', value);
  };

  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium text-slate-200'>
        {t('lastName') || 'Apellido'}
      </label>
      <Input
        type='text'
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={t('lastNamePlaceholder') || 'Ingresa tu apellido'}
        className={`bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        }`}
      />
      {error && (
        <p className='text-sm text-red-400 flex items-center gap-1'>
          <span className='text-red-400'>⚠</span>
          {t(error.message) || error.message}
        </p>
      )}
    </div>
  );
}
