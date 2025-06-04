'use client';

import { cn } from '@/shared/lib/utils/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Home,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  FileText,
  Users2,
  Star,
  HelpCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SimulationStatus } from './components/SimulationStatus';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('sidebar');

  const menuItems = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/home', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/agenda', icon: Calendar, label: t('agenda') },
    { href: '/communication', icon: MessageSquare, label: t('communication') },
    { href: '/project', icon: FileText, label: t('project') },
    { href: '/team', icon: Users2, label: t('team') },
    { href: '/feedback', icon: Star, label: t('feedback') },
    { href: '/help-center', icon: HelpCircle, label: t('helpCenter') }
  ];

  return (
    <nav
      className={cn(
        'flex flex-col h-full w-64 bg-gradient-to-b from-[#0A0B14] to-[#1A1B23] text-[#8B949E]',
        className
      )}
    >
      {/* Logo */}
      <div className='py-6 px-4'>
        <Image
          src='/images/nocountry-logo.png'
          alt='NoCountry'
          width={140}
          height={30}
          className='mx-auto'
        />
      </div>

      {/* Menu Items */}
      <div className='flex-1 px-2 space-y-1'>
        {/* Regular menu items before SIMULATION STATUS */}
        <Link
          href='/'
          className={cn(
            'flex items-center gap-4 px-3 py-2 rounded-lg transition-colors',
            pathname === '/' ? 'bg-white/5 text-white' : 'hover:text-white'
          )}
        >
          <Home size={18} className='opacity-90' />
          <span className='text-[13px]'>{t('home')}</span>
        </Link>

        {/* SIMULATION STATUS - always active for manual control */}
        <SimulationStatus isActive={true} />

        {/* Regular menu items after SIMULATION STATUS */}
        {menuItems.slice(1).map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-3 py-2 rounded-lg transition-colors',
                isActive ? 'bg-white/5 text-white' : 'hover:text-white'
              )}
            >
              {item.icon && <item.icon size={18} className='opacity-90' />}
              <span className='text-[13px]'>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
