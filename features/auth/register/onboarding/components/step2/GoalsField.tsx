import { Checkbox, Label } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { FieldProps } from './lib/types';
import { VALID_GOALS } from '../../lib/validations/onboardingSchemas';

interface GoalsFieldProps extends FieldProps {
  value: string[];
  onChange: (goals: string[]) => void;
}

export function GoalsField({
  value,
  onChange,
  error,
  onValidate
}: GoalsFieldProps) {
  const t = useTranslations('auth.register.onboarding.step2');

  const toggleGoal = (goalKey: string) => {
    const newGoals = value.includes(goalKey)
      ? value.filter(goal => goal !== goalKey)
      : [...value, goalKey];

    onChange(newGoals);
    onValidate('goals', newGoals);
  };

  return (
    <div className='space-y-4'>
      <label className='text-sm font-medium'>{t('goals.label')}</label>
      <div className='space-y-3'>
        {VALID_GOALS.map(goalKey => (
          <div key={goalKey} className='flex items-center space-x-3'>
            <Checkbox
              id={goalKey}
              checked={value.includes(goalKey)}
              onCheckedChange={() => toggleGoal(goalKey)}
              className='border-slate-600 data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]'
            />
            <Label
              htmlFor={goalKey}
              className='text-sm cursor-pointer hover:text-slate-300 transition-colors'
            >
              {t(`goals.${goalKey}`)}
            </Label>
          </div>
        ))}
      </div>
      {error && (
        <p className='text-red-400 text-xs mt-1'>
          {t(error.message || 'Invalid goals')}
        </p>
      )}
    </div>
  );
}
