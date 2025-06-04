'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChromeIcon as Google } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { LoginForm } from './components/LoginForm';
import { NavigationService } from '../lib/utils/route-utils';
import { useLoginForm } from './lib/hooks/useLoginForm';

export function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/home';

  const t = useTranslations('auth.login');

  const {
    email,
    password,
    isLoading,
    fieldErrors,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    handleGoogleLogin,
    validateEmailField,
    validatePasswordField
  } = useLoginForm({
    onSuccess: (isProfileComplete: boolean) => {
      // Usar la lógica centralizada de navegación
      const destination = NavigationService.handlePostLoginRedirect({
        isProfileComplete,
        redirectTo
      });
      router.push(destination);
    }
  });

  return (
    <div className='min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 relative h-screen flex items-center justify-center text-gray-200'>
      <Card className='w-full max-w-md  border-gradient overflow-hidden'>
        <CardHeader className='bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 p-10'>
          <div className='flex justify-center mb-4 '>
            <Image
              src='/images/nocountry-logo.png'
              alt='NoCountry'
              width={180}
              height={40}
            />
          </div>
          <CardTitle className='text-center text-2xl font-bold text-white'>
            {t('title')}
          </CardTitle>
          <CardDescription className='text-center text-gray-400'>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            email={email}
            password={password}
            isLoading={isLoading}
            fieldErrors={fieldErrors}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onSubmit={handleSubmit}
            onEmailBlur={() => validateEmailField(email)}
            onPasswordBlur={() => validatePasswordField(password)}
          />

          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-slate-700/50'></div>
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-slate-900 px-2 text-slate-400'>
                {t('divider')}
              </span>
            </div>
          </div>

          <Button
            type='button'
            variant='outline'
            className='w-full border-slate-700 hover:bg-slate-800/50 hover:text-white flex items-center justify-center gap-2'
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Google className='mr-2 h-4 w-4 text-red-500' />
            {t('google')}
          </Button>
        </CardContent>
        <CardFooter className='bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700/50 p-6 flex justify-center'>
          <p className='text-sm text-slate-400'>
            {t('register.text')}{' '}
            <Link
              href='/register'
              className='text-blue-400 hover:text-blue-300'
            >
              {t('register.link')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
