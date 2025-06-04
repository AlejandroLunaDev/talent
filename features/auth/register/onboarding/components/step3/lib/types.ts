export interface SummaryCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export interface PersonalInfoData {
  fullName: string;
  city: string;
  phone: string;
  languagePreference: string;
}

export interface ProfessionalInfoData {
  role: string;
  seniority: string;
  skills: string[];
  tools: string[];
  goals: string[];
}
