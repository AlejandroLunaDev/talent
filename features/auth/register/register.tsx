'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Route } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { RegisterForm } from './components/RegisterForm';
import type { RegisterFormData } from './types';
import { Button } from '@/shared/ui';
import { ChromeIcon as Google } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { useAuthForm } from '../lib/hooks/useAuthForm';

export default function Register() {
  const router = useRouter();
  const t = useTranslations('auth.register');
  const j = useTranslations('auth.login');

  const { isLoading, error, showLoginLink, handleGoogleLogin, handleRegister } =
    useAuthForm({
      onSuccess: (isProfileComplete: boolean) => {
        // Redirect based on profile completion status
        if (isProfileComplete) {
          // User has completed profile - go to main app
          router.push('/home' as Route);
        } else {
          // User needs to complete onboarding
          router.push('/onboarding' as Route);
        }
      }
    });

  const [formError, setFormError] = React.useState('');

  const handleSubmit = async (data: RegisterFormData) => {
    setFormError('');
    try {
      await handleRegister(data.email, data.password);
    } catch (error) {
      console.error('Registration error:', error);
      setFormError(t('errors.general'));
    }
  };

  return (
    <div className='min-h-screen text-white flex items-center justify-center bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 py-10'>
      <Card className='w-full max-w-md border-gradient overflow-hidden'>
        <CardHeader className='bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 p-8 pb-6'>
          <div className='flex justify-center mb-6'>
            <Image
              src='/images/nocountry-logo.png'
              alt='NoCountry'
              width={180}
              height={40}
            />
          </div>
          <CardTitle className='text-2xl text-center font-bold mb-1'>
            {t('title')}
          </CardTitle>
          <CardDescription className='text-center text-base text-slate-300 mb-0'>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className='p-8 pt-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80'>
          <RegisterForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error || formError}
            showLoginLink={showLoginLink}
          />

          <div className='mt-8'>
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
              {j('google')}
            </Button>
          </div>
        </CardContent>
        <CardFooter className='bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700/50 p-6 flex justify-center'>
          <p className='text-sm text-slate-400'>
            {t('login.text')}{' '}
            <Link href='/login' className='text-blue-400 hover:text-blue-300'>
              {t('login.link')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
