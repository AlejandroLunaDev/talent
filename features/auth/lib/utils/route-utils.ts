/**
 * Navigation utility functions for authentication flow
 * Centralizes routing logic for consistent navigation behavior
 */

export interface RedirectParams {
  isProfileComplete: boolean;
  redirectTo?: string;
  defaultRoute?: string;
}

/**
 * Enum for different user navigation states
 */
export enum UserNavigationState {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  AUTHENTICATED_INCOMPLETE = 'AUTHENTICATED_INCOMPLETE',
  AUTHENTICATED_COMPLETE = 'AUTHENTICATED_COMPLETE'
}

/**
 * Route constants
 */
export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/register',
  ONBOARDING: '/onboarding'
} as const;

/**
 * Get user navigation state based on authentication and profile status
 */
export function getUserNavigationState(
  isAuthenticated: boolean,
  isProfileComplete: boolean
): UserNavigationState {
  if (!isAuthenticated) {
    return UserNavigationState.UNAUTHENTICATED;
  }

  return isProfileComplete
    ? UserNavigationState.AUTHENTICATED_COMPLETE
    : UserNavigationState.AUTHENTICATED_INCOMPLETE;
}

/**
 * Service for handling authentication-related navigation
 */
export class NavigationService {
  // Default routes for different states
  private static readonly DEFAULT_AUTHENTICATED_ROUTE = '/home';
  private static readonly DEFAULT_ONBOARDING_ROUTE = '/onboarding';
  private static readonly DEFAULT_LOGIN_ROUTE = '/login';

  /**
   * Get destination route based on user state and current path
   */
  static getDestinationRoute(
    userState: UserNavigationState,
    currentPath: string
  ): string {
    switch (userState) {
      case UserNavigationState.UNAUTHENTICATED:
        return this.DEFAULT_LOGIN_ROUTE;
      case UserNavigationState.AUTHENTICATED_INCOMPLETE:
        return this.DEFAULT_ONBOARDING_ROUTE;
      case UserNavigationState.AUTHENTICATED_COMPLETE:
        return this.DEFAULT_AUTHENTICATED_ROUTE;
      default:
        return this.DEFAULT_LOGIN_ROUTE;
    }
  }

  /**
   * Determines where to redirect user after successful login
   * @param isProfileComplete - Whether user has completed their profile
   * @param redirectTo - Optional specific redirect URL
   * @param defaultRoute - Optional default route override
   * @returns The URL to redirect to
   */
  static handlePostLoginRedirect({
    isProfileComplete,
    redirectTo,
    defaultRoute
  }: RedirectParams): string {
    // If user hasn't completed profile, always go to onboarding
    if (!isProfileComplete) {
      console.log('🔄 Redirecting to onboarding - profile incomplete');
      return this.DEFAULT_ONBOARDING_ROUTE;
    }

    // If there's a specific redirect URL, use it
    if (redirectTo && this.isValidRedirectUrl(redirectTo)) {
      console.log('🔄 Redirecting to specified URL:', redirectTo);
      return redirectTo;
    }

    // Otherwise use default route or fallback
    const destination = defaultRoute || this.DEFAULT_AUTHENTICATED_ROUTE;
    console.log('🔄 Redirecting to default route:', destination);
    return destination;
  }

  /**
   * Determines redirect after successful registration
   * @param isProfileComplete - Whether user has completed their profile (usually false for new users)
   * @returns The URL to redirect to
   */
  static handlePostRegistrationRedirect(isProfileComplete: boolean): string {
    // New users typically need onboarding
    if (!isProfileComplete) {
      console.log('🔄 New user - redirecting to onboarding');
      return this.DEFAULT_ONBOARDING_ROUTE;
    }

    // If somehow profile is complete (edge case), go to home
    console.log('🔄 Profile complete - redirecting to home');
    return this.DEFAULT_AUTHENTICATED_ROUTE;
  }

  /**
   * Handles logout redirect
   * @param customRedirect - Optional custom redirect after logout
   * @returns The URL to redirect to after logout
   */
  static handleLogoutRedirect(customRedirect?: string): string {
    if (customRedirect && this.isValidRedirectUrl(customRedirect)) {
      return customRedirect;
    }
    return this.DEFAULT_LOGIN_ROUTE;
  }

  /**
   * Validates if a redirect URL is safe to use
   * @param url - The URL to validate
   * @returns Whether the URL is safe for redirection
   */
  private static isValidRedirectUrl(url: string): boolean {
    // Prevent open redirect vulnerabilities
    try {
      const urlObj = new URL(url, window.location.origin);

      // Only allow same-origin redirects
      if (urlObj.origin !== window.location.origin) {
        console.warn('⚠️ Rejecting external redirect URL:', url);
        return false;
      }

      // Block certain paths
      const blockedPaths = ['/login', '/register'];
      if (blockedPaths.some(path => urlObj.pathname.startsWith(path))) {
        console.warn('⚠️ Rejecting redirect to auth page:', url);
        return false;
      }

      return true;
    } catch (error) {
      console.warn('⚠️ Invalid redirect URL:', url, error);
      return false;
    }
  }

  /**
   * Creates a login URL with redirect parameter
   * @param redirectTo - Where to redirect after login
   * @returns Login URL with redirect parameter
   */
  static createLoginUrl(redirectTo?: string): string {
    const loginUrl = new URL(this.DEFAULT_LOGIN_ROUTE, window.location.origin);

    if (redirectTo && this.isValidRedirectUrl(redirectTo)) {
      loginUrl.searchParams.set('redirect', redirectTo);
    }

    return loginUrl.pathname + loginUrl.search;
  }

  /**
   * Gets the current page URL for use as a redirect parameter
   * @returns Current page path
   */
  static getCurrentPageForRedirect(): string {
    return window.location.pathname + window.location.search;
  }

  /**
   * Utility to check if user should be redirected to login
   * @param pathname - Current pathname
   * @returns Whether redirect to login is needed
   */
  static shouldRedirectToLogin(pathname: string): boolean {
    const publicPaths = [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password'
    ];
    return !publicPaths.some(path => pathname.startsWith(path));
  }

  /**
   * Utility to check if user should be redirected from auth pages when already logged in
   * @param pathname - Current pathname
   * @returns Whether redirect from auth page is needed
   */
  static shouldRedirectFromAuthPages(pathname: string): boolean {
    const authPaths = ['/login', '/register'];
    return authPaths.some(path => pathname.startsWith(path));
  }
}
