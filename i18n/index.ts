import { getRequestConfig } from 'next-intl/server';
import { locales } from './routing';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) locale = 'en';
 
  return {
    messages: (await import(`../langs/${locale}.json`)).default
  };
}); 