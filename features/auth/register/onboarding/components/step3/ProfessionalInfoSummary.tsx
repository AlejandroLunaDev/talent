import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/ui';
import { SummaryCard } from './SummaryCard';
import { ProfessionalInfoData } from './lib/types';
import { ROLE_OPTIONS } from '../step2/lib/constants';

interface ProfessionalInfoSummaryProps {
  data: ProfessionalInfoData;
}

export function ProfessionalInfoSummary({
  data
}: ProfessionalInfoSummaryProps) {
  const tStep2 = useTranslations('auth.register.onboarding.step2');
  const tStep3 = useTranslations('auth.register.onboarding.step3');

  // Find role display info
  const roleInfo = ROLE_OPTIONS.find(role => role.value === data.role);

  const renderGoals = () => {
    if (!Array.isArray(data.goals) || data.goals.length === 0) {
      return ['N/A'];
    }
    return data.goals.map(goalKey => tStep2(`goals.${goalKey}`));
  };

  return (
    <SummaryCard title={tStep3('professionalInfo')} icon='💼'>
      <div className='space-y-6'>
        {/* Role & Seniority */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-slate-700/20 to-slate-600/20 border border-slate-600/30'>
            <div className='text-2xl'>{roleInfo?.emoji || '💼'}</div>
            <div>
              <p className='text-xs text-slate-400 uppercase tracking-wide font-medium'>
                {tStep2('role.label')}
              </p>
              <p className='text-white font-semibold'>
                {roleInfo?.label || data.role || 'N/A'}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-slate-700/20 to-slate-600/20 border border-slate-600/30'>
            <div className='text-2xl'>📊</div>
            <div>
              <p className='text-xs text-slate-400 uppercase tracking-wide font-medium'>
                {tStep2('seniority.label')}
              </p>
              <p className='text-white font-semibold capitalize'>
                {data.seniority?.replace('-', ' ') || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <span className='text-lg'>🎯</span>
            <h4 className='text-sm font-semibold text-slate-300 uppercase tracking-wide'>
              {tStep2('skills.label')}
            </h4>
          </div>
          <div className='flex flex-wrap gap-2'>
            {Array.isArray(data.skills) && data.skills.length > 0 ? (
              data.skills.map(skill => (
                <Badge
                  key={skill}
                  variant='outline'
                  className='border-[#00BFFF]/60 text-[#00BFFF] bg-[#00BFFF]/10 hover:bg-[#00BFFF]/20 transition-colors'
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className='text-slate-400 text-sm'>No skills added</span>
            )}
          </div>
        </div>

        {/* Tools */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <span className='text-lg'>🛠️</span>
            <h4 className='text-sm font-semibold text-slate-300 uppercase tracking-wide'>
              {tStep2('tools.label')}
            </h4>
          </div>
          <div className='flex flex-wrap gap-2'>
            {Array.isArray(data.tools) && data.tools.length > 0 ? (
              data.tools.map(tool => (
                <Badge
                  key={tool}
                  variant='outline'
                  className='border-[#FF1493]/60 text-[#FF1493] bg-[#FF1493]/10 hover:bg-[#FF1493]/20 transition-colors'
                >
                  {tool}
                </Badge>
              ))
            ) : (
              <span className='text-slate-400 text-sm'>No tools added</span>
            )}
          </div>
        </div>

        {/* Goals */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <span className='text-lg'>🚀</span>
            <h4 className='text-sm font-semibold text-slate-300 uppercase tracking-wide'>
              {tStep2('goals.label')}
            </h4>
          </div>
          <div className='flex flex-wrap gap-2'>
            {renderGoals().map((goal, index) => (
              <Badge
                key={index}
                variant='outline'
                className='border-purple-400/60 text-purple-300 bg-purple-400/10 hover:bg-purple-400/20 transition-colors'
              >
                {goal}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </SummaryCard>
  );
}
