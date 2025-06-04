import { z } from 'zod';

// Schema for forgot password (email only)
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'email.error.required').email('email.error.invalid')
});

// Type definitions
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Helper function for validation
export const validateForgotPassword = (data: unknown) => {
  try {
    return {
      success: true,
      data: forgotPasswordSchema.parse(data)
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
