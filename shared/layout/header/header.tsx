'use client';

import { Bell } from 'lucide-react';
import { UserMenu } from '../user/user-menu';
import LanguageSwitcher from '../langSelector/langSelector';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Route } from 'next';

export default function Header() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_OUT') {
          router.push('/login' as Route);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Adapt Supabase user_metadata to our UserMetadata interface
  const adaptUserMetadata = (supabaseMetadata: any) => {
    return {
      avatar_url: supabaseMetadata?.avatar_url || '',
      email: supabaseMetadata?.email || user?.email || '',
      email_verified: supabaseMetadata?.email_verified || false,
      full_name:
        supabaseMetadata?.full_name || supabaseMetadata?.name || 'Usuario',
      name: supabaseMetadata?.name || supabaseMetadata?.full_name || 'Usuario',
      phone_verified: supabaseMetadata?.phone_verified || false,
      picture: supabaseMetadata?.picture || supabaseMetadata?.avatar_url || '',
      provider_id: supabaseMetadata?.provider_id || '',
      sub: supabaseMetadata?.sub || user?.id || ''
    };
  };

  if (!user) return null;

  return (
    <header className='bg-slate-900 w-full flex justify-between items-center px-8 py-4'>
      <div className='relative'>
        <Bell className='h-5 w-5 text-muted-foreground' />
        {/*             <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-gradient-to-r from-[#FF1493] to-[#00BFFF]">
              3
            </Badge> */}
      </div>

      <div className='flex items-center gap-4'>
        <UserMenu
          user={adaptUserMetadata(user.user_metadata)}
          onLogout={handleLogout}
        />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
