'use client';

import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { ConfirmPasswordField } from './ConfirmPasswordField';
import { SubmitButton } from './SubmitButton';
import { useRegisterForm } from '../lib/hooks/useRegisterForm';
import type { RegisterFormProps } from '../types';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';

export function RegisterForm({
  onSubmit,
  isLoading,
  error: externalError,
  showLoginLink = false
}: RegisterFormProps & { showLoginLink?: boolean }) {
  const {
    formData,
    errors,
    showPassword,
    isFormValid,
    updateField,
    handleFieldBlur,
    handleSubmit
  } = useRegisterForm({ onSubmit, isLoading });

  const t = useTranslations('auth.register');

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <EmailField
        value={formData.email}
        onChange={value => updateField('email', value)}
        error={errors.email}
        disabled={isLoading}
        onBlur={handleFieldBlur}
      />

      <PasswordField
        value={formData.password}
        onChange={value => updateField('password', value)}
        error={errors.password}
        disabled={isLoading}
        showRequirements={true}
        onBlur={handleFieldBlur}
      />

      <ConfirmPasswordField
        value={formData.confirmPassword}
        onChange={value => updateField('confirmPassword', value)}
        error={errors.confirmPassword}
        disabled={isLoading}
        showPassword={showPassword}
        onBlur={handleFieldBlur}
      />

      {externalError && (
        <div className='rounded-md bg-red-500/20 border border-red-500/50 p-4'>
          <div className='flex items-start gap-3'>
            <AlertCircle className='h-5 w-5 text-red-400 flex-shrink-0 mt-0.5' />
            <div className='flex-1'>
              <p className='text-red-200 text-sm leading-relaxed'>
                {externalError}
              </p>
              {showLoginLink && (
                <div className='mt-3'>
                  <Link
                    href='/login'
                    className='inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200'
                  >
                    {t('login.link')}
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <SubmitButton
        isLoading={isLoading}
        isValid={isFormValid}
        disabled={false}
      />
    </form>
  );
}
