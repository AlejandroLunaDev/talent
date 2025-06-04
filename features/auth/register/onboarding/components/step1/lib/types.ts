// Re-export from central types for consistency
export {
  type Country,
  type CountryListType,
  type FieldError
} from '@/shared/types/onboarding';
import type { Step1FormData } from '../../../lib/validations/onboardingSchemas';
import type { FieldError } from '@/shared/types/onboarding';

export interface FieldProps<T = string> {
  error?: FieldError;
  onValidate: (field: T, value: any) => void;
}

// Specific type for Step1 field validation
export type Step1FieldProps = FieldProps<keyof Step1FormData>;
