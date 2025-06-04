import { RadioGroup, RadioGroupItem, Label } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { Step1FieldProps } from './lib/types';

interface LanguagePreferenceFieldProps extends Step1FieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguagePreferenceField({
  value,
  onChange,
  onValidate
}: LanguagePreferenceFieldProps) {
  const t = useTranslations('auth.register.onboarding.step1');

  const handleChange = (newValue: string) => {
    if (newValue !== value) {
      onChange(newValue);
      onValidate('languagePreference', newValue);
    }
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>
        {t('languagePreference.label')}
      </label>
      <RadioGroup
        value={value}
        onValueChange={handleChange}
        className='flex gap-2'
      >
        <div className='flex-1'>
          <RadioGroupItem
            value='english'
            id='english'
            className='peer sr-only'
          />
          <Label
            htmlFor='english'
            className='flex h-9 w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 text-sm font-medium hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#00BFFF]/20 peer-data-[state=checked]:to-transparent peer-data-[state=checked]:border-[#00BFFF] peer-data-[state=checked]:text-[#00BFFF] cursor-pointer transition-all'
          >
            {t('languagePreference.english')}
          </Label>
        </div>
        <div className='flex-1'>
          <RadioGroupItem
            value='español'
            id='español'
            className='peer sr-only'
          />
          <Label
            htmlFor='español'
            className='flex h-9 w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 text-sm font-medium hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#FF1493]/20 peer-data-[state=checked]:to-transparent peer-data-[state=checked]:border-[#FF1493] peer-data-[state=checked]:text-[#FF1493] cursor-pointer transition-all'
          >
            {t('languagePreference.spanish')}
          </Label>
        </div>
        <div className='flex-1'>
          <RadioGroupItem
            value='português'
            id='português'
            className='peer sr-only'
          />
          <Label
            htmlFor='português'
            className='flex h-9 w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 text-sm font-medium hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-[#00BFFF]/20 peer-data-[state=checked]:to-transparent peer-data-[state=checked]:border-[#00BFFF] peer-data-[state=checked]:text-[#00BFFF] cursor-pointer transition-all'
          >
            {t('languagePreference.portuguese')}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
