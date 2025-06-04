import { ChangeEvent } from 'react';
import { Input } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { FieldError } from './lib/types';

interface FullNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: FieldError;
  onValidate?: (field: any, value: any) => void; // Optional since this field doesn't validate
}

export function FullNameField({
  value,
  onChange,
  error,
  onValidate
}: FullNameFieldProps) {
  const t = useTranslations('auth.register.onboarding.step1');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    // No validation here since this is a composite field
    // Validation happens at the form level for firstName/lastName
  };

  return (
    <div className='space-y-2'>
      <label htmlFor='fullName' className='text-sm font-medium'>
        {t('fullName.label')}
      </label>
      <Input
        id='fullName'
        placeholder={t('fullName.placeholder')}
        value={value}
        onChange={handleChange}
        required
        className='bg-slate-800/50 border-slate-700'
      />
      {error && (
        <p className='text-red-400 text-xs mt-1'>
          {t(error.message || 'Invalid name')}
        </p>
      )}
    </div>
  );
}
