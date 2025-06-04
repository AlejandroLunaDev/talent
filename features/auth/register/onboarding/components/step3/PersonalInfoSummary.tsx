import { useTranslations } from 'next-intl';
import { SummaryCard } from './SummaryCard';
import { PersonalInfoData } from './lib/types';

interface PersonalInfoSummaryProps {
  data: PersonalInfoData;
}

export function PersonalInfoSummary({ data }: PersonalInfoSummaryProps) {
  const tStep1 = useTranslations('auth.register.onboarding.step1');
  const tStep3 = useTranslations('auth.register.onboarding.step3');

  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const infoItems = [
    {
      label: tStep1('fullName.label'),
      value: fullName,
      icon: '👤'
    },
    {
      label: tStep1('city'),
      value: data.city,
      icon: '📍'
    },
    {
      label: tStep1('phone.label'),
      value: data.phone,
      icon: '📱'
    },
    {
      label: tStep1('languagePreference.label'),
      value: data.languagePreference,
      icon: '🌐'
    }
  ];

  return (
    <SummaryCard title={tStep3('personalInfo')} icon='👋'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {infoItems.map((item, index) => (
          <div
            key={index}
            className='flex items-center gap-3 p-3 rounded-lg bg-slate-700/20 hover:bg-slate-700/30 transition-colors'
          >
            <span className='text-lg opacity-70'>{item.icon}</span>
            <div className='flex-1 min-w-0'>
              <p className='text-xs text-slate-400 uppercase tracking-wide font-medium'>
                {item.label}
              </p>
              <p className='text-sm text-white font-medium truncate'>
                {item.value || 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SummaryCard>
  );
}
