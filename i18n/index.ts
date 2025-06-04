import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is always a valid string and is one of our supported locales
  const validLocale: string =
    locale && routing.locales.includes(locale as any)
      ? locale
      : routing.defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../langs/${validLocale}.json`)).default
  };
});
