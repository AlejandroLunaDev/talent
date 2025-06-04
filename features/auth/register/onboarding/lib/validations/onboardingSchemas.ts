import { z } from 'zod';

// Schema for Step 1 - Personal Information
export const step1Schema = z.object({
  firstName: z
    .string()
    .min(2, 'firstNameError.minLength')
    .regex(
      /^[^0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`-]*$/,
      'firstNameError.specialChars'
    ),
  lastName: z
    .string()
    .min(2, 'lastNameError.minLength')
    .regex(
      /^[^0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`-]*$/,
      'lastNameError.specialChars'
    ),
  country: z.string().min(1, 'countryError.required'),
  city: z.string().min(1, 'cityError.required'),
  phone: z
    .string()
    .min(1, 'phone.error.required')
    .regex(/^[0-9]+$/, 'phone.error.digitsOnly'),
  languagePreference: z.string().min(1, 'languagePreference.error.required')
});

// Type for Step 1 form data
export type Step1FormData = z.infer<typeof step1Schema>;

// Helper function to validate Step 1 data
export const validateStep1 = (data: unknown) => {
  try {
    return {
      success: true,
      data: step1Schema.parse(data)
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

// Valid role options
export const VALID_ROLES = [
  'frontend',
  'backend',
  'pm',
  'tech-lead',
  'ux-ui',
  'community-manager',
  'devops',
  'qa',
  'full-stack'
] as const;

// Valid seniority levels
export const VALID_SENIORITY_LEVELS = [
  'junior',
  'mid-level',
  'senior',
  'lead',
  'manager'
] as const;

// Valid goal options
export const VALID_GOALS = [
  'entrepreneurship',
  'freelancer',
  'professionalDevelopment',
  'remoteWork'
] as const;

// Schema for Step 2 - Professional Information
export const step2Schema = z.object({
  role: z.enum(VALID_ROLES, {
    errorMap: () => ({ message: 'role.error.invalid' })
  }),
  seniority: z.enum(VALID_SENIORITY_LEVELS, {
    errorMap: () => ({ message: 'seniority.error.invalid' })
  }),
  skills: z
    .array(
      z
        .string()
        .min(1, 'skills.error.empty')
        .max(50, 'skills.error.maxLength')
        .regex(/^[\w\s\-\+\#\.\/\(\)]+$/, 'skills.error.invalidChars')
    )
    .min(1, 'skills.error.required')
    .max(20, 'skills.error.maxItems'),
  tools: z
    .array(
      z
        .string()
        .min(1, 'tools.error.empty')
        .max(50, 'tools.error.maxLength')
        .regex(/^[\w\s\-\+\#\.\/\(\)]+$/, 'tools.error.invalidChars')
    )
    .min(1, 'tools.error.required')
    .max(15, 'tools.error.maxItems'),
  goals: z
    .array(z.enum(VALID_GOALS))
    .min(1, 'goals.error.required')
    .max(4, 'goals.error.maxItems')
});

// Type for Step 2 form data
export type Step2FormData = z.infer<typeof step2Schema>;

// Helper function to validate Step 2 data
export const validateStep2 = (data: unknown) => {
  try {
    return {
      success: true,
      data: step2Schema.parse(data)
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
