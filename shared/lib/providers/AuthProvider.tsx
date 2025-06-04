'use client';

import { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import {
  useSessionContext,
  SessionContextProvider
} from '@supabase/auth-helpers-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useSessionContext();

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Exportar el provider de sesión para envolver la app en el layout
export { SessionContextProvider };
