'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UserMetadata } from '@/shared/types/user';
import { Route } from 'next';

interface UserMenuProps {
  user: UserMetadata;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const router = useRouter();
  const t = useTranslations('userMenu');

  const handleProfileRedirect = () => {
    router.push('/profile' as Route);
  };

  // Provide fallback values for user properties if they are null or undefined
  const userName = user?.name || 'Usuario';
  const userPicture = user?.picture || '';
  const userFullName = user?.full_name || 'Usuario';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 rounded-full group'>
        <div className='flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/5 transition-colors duration-200'>
          <Avatar className='h-8 w-8 border-2 border-white/10'>
            <AvatarImage src={userPicture} alt={userName} />
            <AvatarFallback className='bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm font-semibold'>
              {userName.length > 0 ? userName[0].toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className='h-4 w-4 text-slate-400 group-hover:text-slate-300 transition-colors duration-200' />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-64 p-0 border-0 shadow-2xl'
        style={{
          background:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* User Info Section */}
        <div className='px-4 py-4 border-b border-slate-700/50'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-12 w-12 border-2 border-white/10'>
              <AvatarImage src={userPicture} alt={userName} />
              <AvatarFallback className='bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold'>
                {userName.length > 0 ? userName[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className='space-y-1 flex-1 min-w-0'>
              <p
                className='text-sm font-semibold leading-none text-slate-100 truncate'
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
              >
                {userFullName}
              </p>
              <button
                onClick={handleProfileRedirect}
                className='text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline'
                style={{ letterSpacing: '0.02em' }}
              >
                {t('viewProfile') || 'Ver perfil'}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className='py-2'>
          <DropdownMenuItem
            onClick={handleProfileRedirect}
            className='cursor-pointer mx-2 mb-1 px-3 py-2.5 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-white/5 transition-all duration-200 focus:bg-white/5 focus:text-slate-100'
          >
            <User className='mr-3 h-4 w-4' />
            <span className='text-sm font-medium'>
              {t('profile') || 'Perfil'}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onLogout}
            className='cursor-pointer mx-2 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 focus:bg-red-500/10 focus:text-red-300'
          >
            <LogOut className='mr-3 h-4 w-4' />
            <span className='text-sm font-medium'>
              {t('logout') || 'Cerrar sesión'}
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
