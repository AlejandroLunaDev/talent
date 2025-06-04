'use client';

import { AuthProvider } from './AuthProvider';
import { QueryProvider } from './QueryProvider';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '../utils/supabaseClient';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </SessionContextProvider>
  );
}

export * from './AuthProvider';
export * from './QueryProvider';
