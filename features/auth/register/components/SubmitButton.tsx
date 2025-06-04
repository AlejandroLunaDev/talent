import { Button } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { SubmitButtonProps } from '../lib/types';

export function SubmitButton({
  isLoading,
  isValid,
  disabled
}: SubmitButtonProps) {
  const t = useTranslations('auth.register');

  return (
    <Button
      type='submit'
      className='w-full bg-gradient-to-r from-[#FF1493] to-[#00BFFF] hover:from-[#FF1493]/90 hover:to-[#00BFFF]/90 disabled:from-slate-600 disabled:to-slate-700 transition-all duration-300'
      disabled={isLoading || !isValid || disabled}
    >
      {isLoading ? t('loading') : t('submit')}
    </Button>
  );
}
 