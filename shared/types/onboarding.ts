// Central onboarding types for better architecture and consistency

export interface OnboardingPersonalInfo {
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  phone: string;
  languagePreference: string;
  selectedCountryCode: string | null;
}

export interface OnboardingProfessionalInfo {
  role: string;
  seniority: string;
  skills: string[];
  tools: string[];
  goals: string[];
}

export interface OnboardingCompleteData
  extends OnboardingPersonalInfo,
    OnboardingProfessionalInfo {
  id?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Validation states
export interface FieldError {
  path: (string | number)[];
  message: string;
}

export interface ValidationResult {
  success: boolean;
  errors?: FieldError[];
}

// Step completion status
export interface OnboardingStepStatus {
  step1: boolean;
  step2: boolean;
  step3: boolean;
}

// Phone number related types
export interface Country {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
}

export interface CountryListType {
  getAll: () => Country[];
}

// Export computed types for components
export type PersonalInfoData = Pick<
  OnboardingPersonalInfo,
  'firstName' | 'lastName' | 'city' | 'phone' | 'languagePreference'
>;
export type ProfessionalInfoData = OnboardingProfessionalInfo;
