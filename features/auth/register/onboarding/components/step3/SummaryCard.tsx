import { Card, CardContent, CardHeader } from '@/shared/ui';
import { SummaryCardProps } from './lib/types';

export function SummaryCard({
  title,
  icon,
  children,
  className = ''
}: SummaryCardProps) {
  return (
    <Card
      className={`group bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-300 hover:border-slate-600/50 hover:shadow-lg hover:shadow-slate-900/20 ${className}`}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl group-hover:scale-110 transition-transform duration-300'>
            {icon}
          </div>
          <h3 className='text-lg font-semibold text-white group-hover:text-slate-100 transition-colors'>
            {title}
          </h3>
        </div>
      </CardHeader>
      <CardContent className='pt-0'>{children}</CardContent>
    </Card>
  );
}
