import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/shared/lib/providers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Suspense } from 'react';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NoCountry Talent',
  description: 'Work directly with leading companies in real-world simulations'
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  /*   if (!routing.locales.includes(locale)) {
    notFound(); 
  } */
  const messages = await getMessages({ locale });
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Suspense fallback={null}>{children}</Suspense>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
