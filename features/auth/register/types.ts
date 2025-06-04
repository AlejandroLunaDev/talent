export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  error: string;
  isLoading: boolean;
}
