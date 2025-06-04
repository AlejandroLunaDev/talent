// Define development configuration for authentication flow
// This file controls profile completeness checking during development

interface ProfileData {
  full_name?: string;
  city?: string;
  phone?: string;
  language_preference?: string;
  role?: string;
  seniority?: string;
  skills?: string[];
  tools?: string[];
  goals?: string[];
}

// Development flag to control profile checking
const DEV_FORCE_ONBOARDING = false; // Set to true to always force onboarding
const DEV_SKIP_DB_CHECK = false; // Set to true to skip database checks in development
const DEV_SIMULATE_COMPLETE_PROFILE = false; // Set to true to simulate completed onboarding (bypass onboarding flow)

/**
 * Check if user profile is complete based on onboarding data
 * @param userId - The user ID to check
 * @returns Promise<boolean> - Whether the profile is complete
 */
export const checkProfileCompleteness = async (
  userId: string
): Promise<boolean> => {
  try {
    // In development, you can simulate a completed profile to bypass onboarding
    if (
      DEV_SIMULATE_COMPLETE_PROFILE &&
      process.env.NODE_ENV !== 'production'
    ) {
      console.log(
        '🔧 Development: Simulating completed profile, skipping onboarding'
      );
      return true;
    }

    // In development, you can force onboarding by setting DEV_FORCE_ONBOARDING to true
    if (DEV_FORCE_ONBOARDING) {
      console.log('🔧 Development: Forcing onboarding flow');
      return false;
    }

    // Skip database checks in development to avoid errors
    if (DEV_SKIP_DB_CHECK && process.env.NODE_ENV !== 'production') {
      console.log(
        '🔧 Development: Skipping database check, assuming profile incomplete'
      );
      return false;
    }

    // Validate userId
    if (!userId || typeof userId !== 'string') {
      console.warn('Invalid userId provided to checkProfileCompleteness');
      return false;
    }

    // Import Supabase client here to avoid circular dependencies
    const { createClientComponentClient } = await import(
      '@supabase/auth-helpers-nextjs'
    );
    const supabase = createClientComponentClient();

    // Check if we have a valid session first
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.log('No valid session for profile check');
      return false;
    }

    // Query the profiles table to check if user has completed onboarding
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(
        `
        full_name,
        city,
        phone,
        language_preference,
        role,
        seniority,
        skills,
        tools,
        goals
      `
      )
      .eq('id', userId)
      .single();

    if (error) {
      // Don't log errors for common cases like missing table or no profile
      if (
        error.code === 'PGRST116' ||
        error.message?.includes('relation') ||
        error.message?.includes('does not exist')
      ) {
        console.log(
          '📋 Profiles table not configured, assuming profile incomplete'
        );
      } else {
        console.warn('Database query failed, assuming profile incomplete');
      }
      return false;
    }

    if (!profile) {
      console.log('No profile found, needs onboarding');
      return false;
    }

    // Check if all required fields are present and valid
    const requiredFields = [
      'full_name',
      'city',
      'phone',
      'language_preference',
      'role',
      'seniority'
    ] as (keyof ProfileData)[];

    const isComplete =
      requiredFields.every(field => {
        const value = profile[field];
        return value !== null && value !== undefined && value !== '';
      }) &&
      // Also check arrays are not empty
      Array.isArray(profile.skills) &&
      profile.skills.length > 0 &&
      Array.isArray(profile.tools) &&
      profile.tools.length > 0 &&
      Array.isArray(profile.goals) &&
      profile.goals.length > 0;

    console.log('Profile completeness check:', {
      userId: userId.substring(0, 8) + '...',
      isComplete,
      hasRequiredFields: requiredFields.every(field => profile[field]),
      hasSkills: Array.isArray(profile.skills) && profile.skills.length > 0,
      hasTools: Array.isArray(profile.tools) && profile.tools.length > 0,
      hasGoals: Array.isArray(profile.goals) && profile.goals.length > 0
    });

    return isComplete;
  } catch {
    // Silent error handling - just return false without logging
    console.log('Profile check skipped due to configuration');
    return false;
  }
};

/**
 * Service object for profile-related operations
 */
export const ProfileService = {
  checkCompleteness: checkProfileCompleteness
};
