import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { EmailFieldProps } from '../lib/types';

export function EmailField({
  value,
  onChange,
  error,
  disabled,
  onBlur
}: EmailFieldProps) {
  const t = useTranslations('auth.register.email');
  const [isValid, setIsValid] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(emailRegex.test(value));
    } else {
      setIsValid(false);
    }
  }, [value]);

  const handleBlur = () => {
    if (value) {
      setShowValidation(true);
    }
    onBlur?.('email');
  };

  return (
    <div className='space-y-2'>
      <label
        htmlFor='email'
        className='text-sm font-medium flex items-center gap-2'
      >
        {t('label')}
        {showValidation && value && isValid && !error && (
          <CheckCircle className='w-4 h-4 text-green-500' />
        )}
      </label>
      <div className='relative'>
        <Mail className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
        <Input
          id='email'
          type='email'
          placeholder={t('placeholder')}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          className={`pl-10 bg-slate-800/50 border-slate-700 ${
            error
              ? 'border-red-500 focus:border-red-500'
              : showValidation && value && isValid && !error
                ? 'border-green-500 focus:border-green-500'
                : ''
          }`}
          required
        />
      </div>
      {error && (
        <p className='text-sm text-red-400 flex items-center gap-1'>
          <XCircle className='w-4 h-4' />
          {error}
        </p>
      )}
    </div>
  );
}
 