import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { FieldProps } from './lib/types';
import { ROLE_OPTIONS } from './lib/constants';

interface RoleFieldProps extends FieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function RoleField({
  value,
  onChange,
  error,
  onValidate
}: RoleFieldProps) {
  const t = useTranslations('auth.register.onboarding.step2');

  const handleChange = (newValue: string) => {
    onChange(newValue);
    onValidate('role', newValue);
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>{t('role.label')}</label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className='bg-slate-800/50 border-slate-700 h-12'>
          <SelectValue placeholder={t('role.placeholder')} />
        </SelectTrigger>
        <SelectContent className='bg-slate-800 border-slate-700 text-white max-h-[300px]'>
          {ROLE_OPTIONS.map(role => (
            <SelectItem
              key={role.value}
              value={role.value}
              className='hover:bg-slate-700 focus:bg-slate-700 cursor-pointer py-3'
            >
              <div className='flex items-center gap-3 w-full'>
                <span className='text-lg'>{role.emoji}</span>
                <div className='flex flex-col items-start'>
                  <span className='font-medium text-white'>{role.label}</span>
                  <span className='text-xs text-slate-400 capitalize'>
                    {role.value.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className='text-red-400 text-xs mt-1'>
          {t(error.message || 'Invalid role')}
        </p>
      )}
    </div>
  );
}
