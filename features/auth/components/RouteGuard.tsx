'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ProfileService } from '../lib/utils/dev-config';
import {
  NavigationService,
  UserNavigationState,
  getUserNavigationState,
  ROUTES
} from '../lib/utils/route-utils';
import { Route } from 'next';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredState: UserNavigationState;
  fallbackRoute?: string;
}

/**
 * Componente para proteger rutas basado en el estado del usuario
 * Usa la misma estética elegante del Callback pero con funcionalidad declarativa
 */
export function RouteGuard({
  children,
  requiredState,
  fallbackRoute
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const [userState, setUserState] = useState<UserNavigationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('Verificando acceso...');

  useEffect(() => {
    const checkUserState = async () => {
      try {
        setStatus('Verificando autenticación...');

        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setUserState(UserNavigationState.UNAUTHENTICATED);
          return;
        }

        setStatus('Verificando perfil de usuario...');

        // Verificar completitud del perfil
        const isProfileComplete = await ProfileService.checkCompleteness(
          session.user.id
        );

        const currentUserState = getUserNavigationState(
          true,
          isProfileComplete
        );
        setUserState(currentUserState);
      } catch (error) {
        console.error('Error checking user state:', error);
        setStatus('Error durante la verificación');
        setUserState(UserNavigationState.UNAUTHENTICATED);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserState();

    // Escuchar cambios en la autenticación
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUserState(UserNavigationState.UNAUTHENTICATED);
      } else {
        setStatus('Actualizando perfil de usuario...');
        const isProfileComplete = await ProfileService.checkCompleteness(
          session.user.id
        );
        const currentUserState = getUserNavigationState(
          true,
          isProfileComplete
        );
        setUserState(currentUserState);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Redirigir si el estado no coincide con el requerido
  useEffect(() => {
    if (userState && userState !== requiredState) {
      const destination =
        fallbackRoute ||
        NavigationService.getDestinationRoute(userState, pathname);

      setStatus('Redirigiendo...');
      router.replace(destination as Route);
    }
  }, [userState, requiredState, pathname, router, fallbackRoute]);

  // Mostrar loading elegante mientras verificamos el estado
  if (isLoading || !userState || userState !== requiredState) {
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
                  Verificando acceso
                </h2>
                <p className='text-slate-400 text-sm'>{status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * HOC para proteger rutas que requieren usuario no autenticado (públicas)
 */
export function PublicRouteGuard({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard
      requiredState={UserNavigationState.UNAUTHENTICATED}
      fallbackRoute={ROUTES.HOME}
    >
      {children}
    </RouteGuard>
  );
}

/**
 * HOC para proteger rutas que requieren usuario autenticado sin onboarding
 */
export function OnboardingRouteGuard({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard
      requiredState={UserNavigationState.AUTHENTICATED_INCOMPLETE}
      fallbackRoute={ROUTES.LOGIN}
    >
      {children}
    </RouteGuard>
  );
}

/**
 * HOC para proteger rutas que requieren usuario autenticado con onboarding completo
 */
export function AuthenticatedRouteGuard({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard
      requiredState={UserNavigationState.AUTHENTICATED_COMPLETE}
      fallbackRoute={ROUTES.LOGIN}
    >
      {children}
    </RouteGuard>
  );
}
