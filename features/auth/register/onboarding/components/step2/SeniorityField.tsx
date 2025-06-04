import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { FieldProps } from './lib/types';
import { VALID_SENIORITY_LEVELS } from '../../lib/validations/onboardingSchemas';

interface SeniorityFieldProps extends FieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SeniorityField({
  value,
  onChange,
  error,
  onValidate
}: SeniorityFieldProps) {
  const t = useTranslations('auth.register.onboarding.step2');

  const handleChange = (newValue: string) => {
    onChange(newValue);
    onValidate('seniority', newValue);
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>{t('seniority.label')}</label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className='bg-slate-800/50 border-slate-700'>
          <SelectValue placeholder={t('seniority.placeholder')} />
        </SelectTrigger>
        <SelectContent className='bg-slate-800 border-slate-700 text-white'>
          {VALID_SENIORITY_LEVELS.map(level => (
            <SelectItem
              key={level}
              value={level}
              className='hover:bg-slate-700 focus:bg-slate-700 cursor-pointer capitalize'
            >
              {level.replace('-', ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className='text-red-400 text-xs mt-1'>
          {t(error.message || 'Invalid seniority level')}
        </p>
      )}
    </div>
  );
}
