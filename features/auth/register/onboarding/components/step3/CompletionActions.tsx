import { Button } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface CompletionActionsProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  hasAuthToken: boolean;
}

export function CompletionActions({
  onSubmit,
  isSubmitting,
  isDisabled,
  hasAuthToken
}: CompletionActionsProps) {
  const t = useTranslations('auth.register.onboarding.step3');

  return (
    <div className='space-y-4'>
      {/* Status indicator */}
      <div className='flex items-center justify-center gap-2 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50'>
        {hasAuthToken ? (
          <>
            <CheckCircle className='w-5 h-5 text-green-400' />
            <span className='text-sm text-green-400 font-medium'>
              {t('readyToComplete')}
            </span>
          </>
        ) : (
          <>
            <AlertCircle className='w-5 h-5 text-yellow-400' />
            <span className='text-sm text-yellow-400 font-medium'>
              {t('preparingRegistration')}
            </span>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className='space-y-3'>
        <Button
          type='button'
          onClick={onSubmit}
          disabled={isDisabled}
          className='w-full h-12 bg-gradient-to-r from-[#FF1493] to-[#00BFFF] hover:from-[#FF1493]/90 hover:to-[#00BFFF]/90 disabled:from-slate-600 disabled:to-slate-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100'
        >
          {isSubmitting ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='w-5 h-5 animate-spin' />
              {t('completing')}
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <span>🎉</span>
              {t('completeRegistration')}
            </div>
          )}
        </Button>

        <p className='text-xs text-slate-400 text-center leading-relaxed'>
          {t('completionNote')}
        </p>
      </div>
    </div>
  );
}
