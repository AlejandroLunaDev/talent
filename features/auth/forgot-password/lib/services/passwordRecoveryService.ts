import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { ForgotPasswordFormData } from '../validations/passwordRecoverySchemas';

export interface PasswordRecoveryResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Service for handling password recovery operations using Supabase native functionality
 * Following Single Responsibility Principle - focused on password recovery only
 */
export class PasswordRecoveryService {
  private supabase = createClientComponentClient();

  /**
   * Send password recovery email to user using Supabase native functionality
   * @param data - Contains the user's email address
   * @returns Promise with operation result
   */
  async sendRecoveryEmail(
    data: ForgotPasswordFormData
  ): Promise<PasswordRecoveryResult> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (error) {
        return {
          success: false,
          error: this.mapSupabaseError(error.message)
        };
      }

      return {
        success: true,
        message: 'recovery.success.emailSent'
      };
    } catch (error) {
      console.error('Error sending recovery email:', error);
      return {
        success: false,
        error: 'recovery.error.networkError'
      };
    }
  }

  /**
   * Map Supabase error messages to translation keys
   * @param error - Supabase error message
   * @returns Translation key for the error
   */
  private mapSupabaseError(error: string): string {
    if (error.includes('Invalid login credentials')) {
      return 'recovery.error.invalidEmail';
    }
    if (error.includes('Email not confirmed')) {
      return 'recovery.error.emailNotConfirmed';
    }
    if (error.includes('Too many requests')) {
      return 'recovery.error.tooManyRequests';
    }
    if (error.includes('For security purposes')) {
      return 'recovery.error.tooManyRequests';
    }

    return 'recovery.error.general';
  }
}

// Export singleton instance following Dependency Injection principles
export const passwordRecoveryService = new PasswordRecoveryService();
