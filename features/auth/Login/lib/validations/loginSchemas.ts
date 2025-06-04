import { z } from 'zod';

// Schema for login form validation
export const loginSchema = z.object({
  email: z.string().min(1, 'email.error.required').email('email.error.invalid'),
  password: z
    .string()
    .min(1, 'password.error.required')
    .min(8, 'password.error.minLength')
});

// Type for login form data
export type LoginFormData = z.infer<typeof loginSchema>;

// Helper function to validate login data
export const validateLogin = (data: unknown) => {
  try {
    return {
      success: true,
      data: loginSchema.parse(data)
    } as const;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error
      } as const;
    }
    throw error;
  }
};

// Schema for individual field validation (for real-time validation)
export const emailSchema = z
  .string()
  .min(1, 'email.error.required')
  .email('email.error.invalid');

export const passwordSchema = z
  .string()
  .min(1, 'password.error.required')
  .min(8, 'password.error.minLength');
