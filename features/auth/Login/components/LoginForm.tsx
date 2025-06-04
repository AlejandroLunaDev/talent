'use client';

import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Input, Button } from '@/shared/ui';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LoginFieldErrors } from '../lib/types/loginTypes';

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  fieldErrors?: LoginFieldErrors;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEmailBlur?: () => void;
  onPasswordBlur?: () => void;
}

export const LoginForm = ({
  email,
  password,
  isLoading,
  fieldErrors = {},
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onEmailBlur,
  onPasswordBlur
}: LoginFormProps) => {
  const t = useTranslations('auth.login');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      {fieldErrors?.general && (
        <div className='p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-200 text-sm flex items-center gap-2'>
          <AlertCircle className='h-4 w-4 flex-shrink-0' />
          <span>{fieldErrors.general}</span>
        </div>
      )}

      <div className='space-y-2'>
        <label htmlFor='email' className='text-sm font-medium'>
          {t('email.label')}
        </label>
        <div className='relative'>
          <Mail className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
          <Input
            id='email'
            type='email'
            placeholder={t('email.placeholder')}
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            onBlur={onEmailBlur}
            className={`pl-10 bg-slate-800/50 border-slate-700 ${
              fieldErrors?.email
                ? 'border-red-500/50 focus:border-red-500'
                : 'focus:border-blue-500'
            }`}
            aria-invalid={!!fieldErrors?.email}
            aria-describedby={fieldErrors?.email ? 'email-error' : undefined}
          />
          {fieldErrors?.email && (
            <div className='absolute right-3 top-2.5'>
              <AlertCircle className='h-4 w-4 text-red-400' />
            </div>
          )}
        </div>
        {fieldErrors?.email && (
          <p
            id='email-error'
            className='text-sm text-red-400 flex items-center gap-1'
          >
            <span>{fieldErrors.email}</span>
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <label htmlFor='password' className='text-sm font-medium'>
            {t('password.label')}
          </label>
          <Link
            href='/forgot-password'
            className='text-xs text-blue-400 hover:text-blue-300'
          >
            {t('password.forgot')}
          </Link>
        </div>
        <div className='relative'>
          <Lock className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder={t('password.placeholder')}
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            onBlur={onPasswordBlur}
            className={`pl-10 pr-20 bg-slate-800/50 border-slate-700 ${
              fieldErrors?.password
                ? 'border-red-500/50 focus:border-red-500'
                : 'focus:border-blue-500'
            }`}
            aria-invalid={!!fieldErrors?.password}
            aria-describedby={
              fieldErrors?.password ? 'password-error' : undefined
            }
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-10 top-2.5 text-slate-400 hover:text-slate-300 transition-colors duration-200'
            aria-label={
              showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
          {fieldErrors?.password && (
            <div className='absolute right-3 top-2.5'>
              <AlertCircle className='h-4 w-4 text-red-400' />
            </div>
          )}
        </div>
        {fieldErrors?.password && (
          <p
            id='password-error'
            className='text-sm text-red-400 flex items-center gap-1'
          >
            <span>{fieldErrors.password}</span>
          </p>
        )}
      </div>

      <Button
        type='submit'
        className='w-full bg-gradient-to-r from-[#FF1493] to-[#00BFFF] hover:from-[#FF1493]/90 hover:to-[#00BFFF]/90'
        disabled={isLoading}
      >
        {isLoading ? t('loading') : t('submit')}
      </Button>
    </form>
  );
};
