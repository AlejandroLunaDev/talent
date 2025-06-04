import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { PasswordFieldProps, PasswordRequirements } from '../lib/types';

export function PasswordField({
  value,
  onChange,
  error,
  disabled,
  showRequirements = true,
  onBlur
}: PasswordFieldProps) {
  const t = useTranslations('auth.register.password');
  const [showPassword, setShowPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [requirements, setRequirements] = useState<PasswordRequirements>({
    minLength: false,
    uppercase: false,
    specialChar: false
  });

  useEffect(() => {
    if (value) {
      setRequirements({
        minLength: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        specialChar: /[^A-Za-z0-9]/.test(value)
      });
    } else {
      // Reset requirements when field is empty
      setRequirements({
        minLength: false,
        uppercase: false,
        specialChar: false
      });
    }
  }, [value]);

  const handleFocus = () => {
    if (showRequirements) {
      setShowValidation(true);
    }
  };

  const handleBlur = () => {
    // Only hide validation if field is empty and no error
    if (!value && !error) {
      setShowValidation(false);
    }
    onBlur?.('password');
  };

  const RequirementItem = ({
    isMet,
    text
  }: {
    isMet: boolean;
    text: string;
  }) => (
    <div
      className={`flex items-center text-sm ${isMet ? 'text-green-500' : 'text-slate-400'}`}
    >
      {isMet ? (
        <CheckCircle className='h-4 w-4 mr-2' />
      ) : (
        <XCircle className='h-4 w-4 mr-2' />
      )}
      {text}
    </div>
  );

  const allRequirementsMet =
    requirements.minLength &&
    requirements.uppercase &&
    requirements.specialChar;

  return (
    <div className='space-y-2'>
      <label
        htmlFor='password'
        className='text-sm font-medium flex items-center gap-2'
      >
        {t('label')}
        {value && allRequirementsMet && !error && (
          <CheckCircle className='w-4 h-4 text-green-500' />
        )}
      </label>
      <div className='relative'>
        <Lock className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
        <Input
          id='password'
          type={showPassword ? 'text' : 'password'}
          placeholder={t('placeholder')}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`pl-10 pr-10 bg-slate-800/50 border-slate-700 ${
            error
              ? 'border-red-500 focus:border-red-500'
              : value && allRequirementsMet && !error
                ? 'border-green-500 focus:border-green-500'
                : ''
          }`}
          required
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-3 top-2.5 text-slate-400 hover:text-slate-300'
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className='h-4 w-4' />
          ) : (
            <Eye className='h-4 w-4' />
          )}
        </button>
      </div>

      {showRequirements && showValidation && (
        <div className='mt-2 p-3 bg-slate-700/30 rounded-md space-y-1'>
          <p className='text-sm font-medium text-slate-300 mb-2'>
            {t('requirementsTitle')}
          </p>
          <RequirementItem
            isMet={requirements.minLength}
            text={t('requirements.minLength')}
          />
          <RequirementItem
            isMet={requirements.uppercase}
            text={t('requirements.uppercase')}
          />
          <RequirementItem
            isMet={requirements.specialChar}
            text={t('requirements.specialChar')}
          />
        </div>
      )}

      {error && (
        <p className='text-sm text-red-400 flex items-center gap-1'>
          <XCircle className='w-4 h-4' />
          {error}
        </p>
      )}
    </div>
  );
}
 