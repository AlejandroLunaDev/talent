'use client';

import { useOnboardingStore } from '../lib/store/onboardingStore';
import { useSubmitOnboardingSummary } from '../lib/hooks/useSubmitOnboardingSummary';
import { SummaryHeader } from './step3/SummaryHeader';
import { PersonalInfoSummary } from './step3/PersonalInfoSummary';
import { ProfessionalInfoSummary } from './step3/ProfessionalInfoSummary';
import { CompletionActions } from './step3/CompletionActions';
import { PersonalInfoData, ProfessionalInfoData } from './step3/lib/types';

interface OnboardingSummaryProps {
  onSuccess?: () => void;
}

export function OnboardingSummary({ onSuccess }: OnboardingSummaryProps) {
  const {
    fullName,
    languagePreference,
    city,
    phone,
    role,
    seniority,
    skills,
    tools,
    goals,
    isLoading
  } = useOnboardingStore();

  const {
    handleSubmit,
    isLoading: isSubmitting,
    authToken
  } = useSubmitOnboardingSummary({ onSuccess });

  // Prepare data for components
  const personalData: PersonalInfoData = {
    fullName,
    city,
    phone,
    languagePreference
  };

  const professionalData: ProfessionalInfoData = {
    role,
    seniority,
    skills,
    tools,
    goals
  };

  // Determine if the submit button should be disabled - removed authToken dependency
  const areGoalsSelected = Array.isArray(goals) && goals.length > 0;
  const isSubmitDisabled = isSubmitting || !areGoalsSelected;

  return (
    <div className='space-y-8 max-w-4xl mx-auto'>
      <SummaryHeader userName={fullName || 'Usuario'} />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <PersonalInfoSummary data={personalData} />
        <div className='lg:col-span-1'>
          <ProfessionalInfoSummary data={professionalData} />
        </div>
      </div>

      <div className='max-w-md mx-auto'>
        <CompletionActions
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isDisabled={isSubmitDisabled}
          hasAuthToken={true}
        />
      </div>
    </div>
  );
}
