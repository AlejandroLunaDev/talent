import { ChangeEvent } from 'react';
import { Input } from '@/shared/ui';
import { useTranslations } from 'next-intl';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PhoneInput({ value, onChange }: PhoneInputProps) {
  const t = useTranslations('auth.register.onboarding.step1');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputDigits = e.target.value.replace(/\D/g, ''); // Remove non-digits
    onChange(inputDigits);
  };

  return (
    <Input
      id='phone'
      type='tel'
      placeholder={t('phone.placeholder')}
      value={value}
      onChange={handleChange}
      className='flex-1 bg-slate-800/50 border-slate-700 rounded-l-none focus:ring-blue-500 focus:border-blue-500'
    />
  );
}
