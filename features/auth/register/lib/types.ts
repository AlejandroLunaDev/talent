export interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  onBlur?: (field: string) => void;
}

export interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  showRequirements?: boolean;
  onBlur?: (field: string) => void;
}

export interface ConfirmPasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  showPassword: boolean;
  onBlur?: (field: string) => void;
}

export interface PasswordRequirements {
  minLength: boolean;
  uppercase: boolean;
  specialChar: boolean;
}

export interface SubmitButtonProps {
  isLoading: boolean;
  isValid: boolean;
  disabled?: boolean;
}
