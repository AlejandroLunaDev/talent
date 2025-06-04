// Re-export from central types for backward compatibility
export {
  type PersonalInfoData,
  type ProfessionalInfoData
} from '@/shared/types/onboarding';

export interface SummaryCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}
