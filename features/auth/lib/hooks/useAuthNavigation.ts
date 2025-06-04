import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const useAuthNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Establece un valor predeterminado más seguro, por ejemplo, '/' o el valor que realmente exista
  const [callbackUrl, setCallbackUrl] = useState('/home'); // Manteniendo '/home' como predeterminado

  useEffect(() => {
    const callback = searchParams?.get('callbackUrl');
    if (callback) {
      setCallbackUrl(decodeURI(callback));
    }

    // Capturar timezone del navegador
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) {
      localStorage.setItem('user_timezone', timezone);
    }
  }, [searchParams]);

  const navigateAfterLogin = useCallback(() => {
    // Es preferible usar router.push para una navegación más fluida en Next.js
    // Esto evita una recarga completa de la página
    router.push(callbackUrl);
  }, [router, callbackUrl]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    navigateAfterLogin,
    goBack
  };
};
