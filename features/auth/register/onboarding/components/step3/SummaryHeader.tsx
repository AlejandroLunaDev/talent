import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';

interface SummaryHeaderProps {
  userName: string;
}

export function SummaryHeader({ userName }: SummaryHeaderProps) {
  const t = useTranslations('auth.register.onboarding.step3');

  return (
    <div className='text-center space-y-4 mb-8'>
      <div className='flex items-center justify-center gap-2 mb-4'>
        <Sparkles className='w-6 h-6 text-[#00BFFF] animate-pulse' />
        <h2 className='text-2xl font-bold bg-gradient-to-r from-[#FF1493] to-[#00BFFF] bg-clip-text text-transparent'>
          {t('almostDone')}
        </h2>
        <Sparkles className='w-6 h-6 text-[#FF1493] animate-pulse' />
      </div>

      <div className='space-y-2'>
        <p className='text-lg text-slate-200'>
          {t('welcomeMessage', { name: userName })}
        </p>
        <p className='text-sm text-slate-400 max-w-md mx-auto leading-relaxed'>
          {t('reviewInstructions')}
        </p>
      </div>

      {/* Progress dots */}
      <div className='flex items-center justify-center gap-2 pt-4'>
        <div className='w-3 h-3 rounded-full bg-[#00BFFF] opacity-50'></div>
        <div className='w-3 h-3 rounded-full bg-[#FF1493] opacity-50'></div>
        <div className='w-4 h-4 rounded-full bg-gradient-to-r from-[#FF1493] to-[#00BFFF] animate-pulse'></div>
      </div>
    </div>
  );
}
