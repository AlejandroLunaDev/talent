import { Step1FormData } from '../../../lib/validations/onboardingSchemas';

export interface FieldError {
  path: (string | number)[];
  message: string;
}

export interface Country {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
}

export interface CountryListType {
  getAll: () => Country[];
}

export interface FieldProps {
  error?: FieldError;
  onValidate: (fieldName: keyof Step1FormData, value: any) => void;
}
 