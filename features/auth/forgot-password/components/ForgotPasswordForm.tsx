'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui';
import { useForgotPassword } from '../lib/hooks/useForgotPassword';

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const t = useTranslations('auth.forgotPassword');

  const {
    email,
    setEmail,
    isLoading,
    fieldErrors,
    generalError,
    isEmailSent,
    handleSubmit,
    validateField,
    findFieldError
  } = useForgotPassword({ onSuccess });

  const emailError = findFieldError('email');

  // Estado de éxito después de enviar el email
  if (isEmailSent) {
    return (
      <Card className='w-full max-w-md border-gradient overflow-hidden'>
        <CardHeader className='bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 p-10'>
          <div className='flex justify-center mb-4'>
            <Image
              src='/images/nocountry-logo.png'
              alt='NoCountry'
              width={180}
              height={40}
            />
          </div>
          <CardTitle className='text-center text-2xl font-bold text-white'>
            {t('success.title') || '¡Correo enviado!'}
          </CardTitle>
          <CardDescription className='text-center text-gray-400'>
            {t('success.description') ||
              'Te hemos enviado un enlace de recuperación a tu correo electrónico.'}
          </CardDescription>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='space-y-4'>
            <Button
              onClick={() => window.location.reload()}
              variant='outline'
              className='w-full border-slate-700 hover:bg-slate-800/50 hover:text-white'
            >
              {t('success.resendEmail') || 'Reenviar correo'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className='bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700/50 p-6 flex justify-center'>
          <Link
            href='/login'
            className='text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200 flex items-center gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            {t('success.backToLogin') || 'Volver al inicio de sesión'}
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md border-gradient overflow-hidden'>
      <CardHeader className='bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 p-10'>
        <div className='flex justify-center mb-4'>
          <Image
            src='/images/nocountry-logo.png'
            alt='NoCountry'
            width={180}
            height={40}
          />
        </div>
        <CardTitle className='text-center text-2xl font-bold text-white'>
          {t('title') || '¿Olvidaste tu contraseña?'}
        </CardTitle>
        <CardDescription className='text-center text-gray-400'>
          {t('description') ||
            'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.'}
        </CardDescription>
      </CardHeader>

      <CardContent className='p-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Error General */}
          {generalError && (
            <div className='p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-200 text-sm'>
              {t(generalError) || generalError}
            </div>
          )}

          {/* Campo de Email */}
          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-slate-200'
            >
              {t('email.label') || 'Correo electrónico'}
            </label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => validateField('email', email)}
              placeholder={t('email.placeholder') || 'nombre@ejemplo.com'}
              className={`bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 ${
                emailError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : ''
              }`}
              disabled={isLoading}
            />
            {emailError && (
              <p className='text-sm text-red-400 flex items-center gap-1'>
                <span className='text-red-400'>⚠</span>
                {t(emailError.message) || emailError.message}
              </p>
            )}
          </div>

          {/* Botón de Envío */}
          <Button
            type='submit'
            className='w-full bg-gradient-to-r from-[#FF1493] to-[#00BFFF] hover:from-[#FF1493]/90 hover:to-[#00BFFF]/90 text-white font-medium'
            disabled={isLoading || !email}
          >
            {isLoading
              ? t('loading') || 'Enviando...'
              : t('submit') || 'Enviar enlace de recuperación'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className='bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700/50 p-6 flex justify-center'>
        <Link
          href='/login'
          className='text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200 flex items-center gap-2'
        >
          <ArrowLeft className='w-4 h-4' />
          {t('backToLogin') || 'Volver al inicio de sesión'}
        </Link>
      </CardFooter>
    </Card>
  );
}
