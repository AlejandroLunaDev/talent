import { z } from 'zod';

type TranslationFunction = (key: string) => string;

export const createRegisterSchema = (t: TranslationFunction) => {
  return z
    .object({
      email: z
        .string()
        .min(1, t('email.error.required'))
        .email(t('email.error.invalid')),
      password: z
        .string()
        .min(8, t('password.error.minLength'))
        .regex(/[A-Z]/, t('password.error.uppercase'))
        .regex(/[^A-Za-z0-9]/, t('password.error.specialChar')),
      confirmPassword: z.string()
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('confirmPassword.error.mismatch'),
      path: ['confirmPassword']
    });
};

export type RegisterFormSchema = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
