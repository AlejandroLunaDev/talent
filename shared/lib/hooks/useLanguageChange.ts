import { useRouter } from 'next/navigation';
import { useTransition, useCallback } from 'react';

export function useLanguageChange() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const changeLanguage = useCallback((locale: string) => {
    startTransition(() => {
      // Instead of changing the URL path, we'll just refresh the current page
      // The cookie is set by the language selector component
      router.refresh();
    });
  }, [router]);

  return { changeLanguage, isChanging: isPending };
}
