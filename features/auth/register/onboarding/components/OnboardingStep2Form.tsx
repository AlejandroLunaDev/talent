'use client';

import { useCallback } from 'react';
import { Button } from '@/shared/ui';
import { useOnboardingStore } from '../lib/store/onboardingStore';
import { useSubmitOnboardingStep2 } from '../lib/hooks/useSubmitOnboardingStep2';
import { useTranslations } from 'next-intl';
import { FieldError } from './step2/lib/types';
import { RoleField } from './step2/RoleField';
import { SeniorityField } from './step2/SeniorityField';
import { SkillsField } from './step2/SkillsField';
import { ToolsField } from './step2/ToolsField';
import { GoalsField } from './step2/GoalsField';

interface OnboardingStep2FormProps {
  onSuccess?: () => void;
}

export function OnboardingStep2Form({ onSuccess }: OnboardingStep2FormProps) {
  const t = useTranslations('auth.register.onboarding.step2');

  const {
    role,
    setRole,
    seniority,
    setSeniority,
    skills,
    setSkills,
    tools,
    setTools,
    goals,
    setGoals,
    isLoading,
    error
  } = useOnboardingStore();

  const { handleSubmit, fieldErrors, validateField } = useSubmitOnboardingStep2(
    { onSuccess }
  );

  // Helper to find field errors
  const findFieldError = useCallback(
    (fieldName: string): FieldError | undefined =>
      fieldErrors?.find(
        err =>
          err.path.some(p => typeof p === 'string' && p === fieldName) ||
          err.path.includes(fieldName)
      ),
    [fieldErrors]
  );

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className='p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-200 text-sm'>
          {error}
        </div>
      )}

      <RoleField
        value={role}
        onChange={setRole}
        error={findFieldError('role')}
        onValidate={validateField}
      />

      <SeniorityField
        value={seniority}
        onChange={setSeniority}
        error={findFieldError('seniority')}
        onValidate={validateField}
      />

      <SkillsField
        value={skills}
        onChange={setSkills}
        error={findFieldError('skills')}
        onValidate={validateField}
      />

      <ToolsField
        value={tools}
        onChange={setTools}
        error={findFieldError('tools')}
        onValidate={validateField}
      />

      <GoalsField
        value={goals}
        onChange={setGoals}
        error={findFieldError('goals')}
        onValidate={validateField}
      />

      <Button
        type='submit'
        className='w-full bg-gradient-to-r from-[#FF1493] to-[#00BFFF] hover:from-[#FF1493]/90 hover:to-[#00BFFF]/90'
        disabled={
          isLoading ||
          !role ||
          !seniority ||
          skills.length === 0 ||
          tools.length === 0 ||
          goals.length === 0
        }
      >
        {isLoading ? t('saving') : t('completeSetup')}
      </Button>
    </form>
  );
}
