import { Step2FormData } from '../../../lib/validations/onboardingSchemas';

export interface FieldError {
  path: (string | number)[];
  message: string;
}

export interface FieldProps {
  error?: FieldError;
  onValidate: (fieldName: keyof Step2FormData, value: any) => void;
}

export interface RoleOption {
  value: string;
  label: string;
  emoji: string;
}

export interface AutocompleteOption {
  value: string;
  label: string;
}
