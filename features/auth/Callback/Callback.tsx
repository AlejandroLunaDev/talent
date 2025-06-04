'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { checkProfileCompleteness } from '../lib/utils/dev-config';
import { NavigationService, ROUTES } from '../lib/utils/route-utils';

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [status, setStatus] = useState('Autenticando...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for errors in URL params
        const error = searchParams.get('error');
        if (error) {
          console.error('OAuth error:', error);
          setStatus('Error en la autenticación');
          setTimeout(
            () => router.push(`${ROUTES.LOGIN}?error=oauth_error`),
            2000
          );
          return;
        }

        setStatus('Verificando autenticación...');

        // Give a small delay to ensure session is properly set
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the current session
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('Error en la autenticación');
          setTimeout(
            () => router.push(`${ROUTES.LOGIN}?error=session_error`),
            2000
          );
          return;
        }

        if (!session?.user) {
          console.log('No session found, redirecting to login');
          setStatus('No se encontró sesión activa');
          setTimeout(() => router.push(ROUTES.LOGIN), 1500);
          return;
        }

        setStatus('Verificando perfil de usuario...');

        // Check if user profile is complete
        const isProfileComplete = await checkProfileCompleteness(
          session.user.id
        );

        // Usar la lógica centralizada de navegación
        const destination = NavigationService.handlePostLoginRedirect({
          isProfileComplete
        });

        if (isProfileComplete) {
          setStatus('¡Bienvenido! Redirigiendo...');
        } else {
          setStatus('Configurando tu perfil...');
        }

        router.replace(destination);
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('Error durante la autenticación');
        setTimeout(
          () => router.push(`${ROUTES.LOGIN}?error=callback_error`),
          2000
        );
      }
    };

    // Execute the callback handling
    handleCallback();
  }, [router, supabase, searchParams]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4'>
      <div className='bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-slate-700/50 shadow-2xl'>
        <div className='text-center space-y-6'>
          {/* Logo de la aplicación */}
          <div className='flex justify-center'>
            <Image
              src='/images/nocountry-logo.png'
              alt='NoCountry'
              width={140}
              height={30}
            />
          </div>

          {/* Spinner y mensaje */}
          <div className='space-y-4'>
            <div className='flex justify-center'>
              <Loader2 className='h-12 w-12 text-blue-500 animate-spin' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-xl font-semibold text-white'>
                Completando inicio de sesión
              </h2>
              <p className='text-slate-400 text-sm'>{status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
