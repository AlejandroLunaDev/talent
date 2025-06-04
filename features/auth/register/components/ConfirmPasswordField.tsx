import { useState } from 'react';
import { Lock, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { ConfirmPasswordFieldProps } from '../lib/types';

export function ConfirmPasswordField({
  value,
  onChange,
  error,
  disabled,
  showPassword,
  onBlur
}: ConfirmPasswordFieldProps) {
  const t = useTranslations('auth.register.confirmPassword');
  const [showValidation, setShowValidation] = useState(false);

  const handleBlur = () => {
    if (value) {
      setShowValidation(true);
    }
    onBlur?.('confirmPassword');
  };

  const isMatching = value && !error && showValidation;

  return (
    <div className='space-y-2'>
      <label
        htmlFor='confirmPassword'
        className='text-sm font-medium flex items-center gap-2'
      >
        {t('label')}
        {isMatching && <CheckCircle className='w-4 h-4 text-green-500' />}
      </label>
      <div className='relative'>
        <Lock className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
        <Input
          id='confirmPassword'
          type={showPassword ? 'text' : 'password'}
          placeholder={t('placeholder')}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          className={`pl-10 bg-slate-800/50 border-slate-700 ${
            error
              ? 'border-red-500 focus:border-red-500'
              : isMatching
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
 