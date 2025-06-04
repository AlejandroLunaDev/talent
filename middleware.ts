import { NextResponse, type NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import createMiddleware from 'next-intl/middleware';

interface JWTPayload {
  aud: string;
  role: string;
  exp: number;
  sub: string; // user ID
}

// Crear middleware de internacionalización
const intlMiddleware = createMiddleware({
  locales: ['es', 'en', 'pt'],
  defaultLocale: 'es',
  localePrefix: 'never',
  localeDetection: true
});

// Configuración de rutas
const ROUTE_CONFIG = {
  // Rutas completamente públicas (sin autenticación)
  PUBLIC: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/callback',
    '/api/auth/login',
    '/api/auth/callback',
    '/api/test'
  ],
  // Rutas que requieren autenticación pero sin onboarding completo
  AUTH_ONLY: ['/onboarding'],
  // Rutas que requieren autenticación Y onboarding completo
  PROTECTED: ['/home', '/profile', '/dashboard']
} as const;

// Clases para manejar diferentes tipos de usuarios
class UserAuthState {
  constructor(
    public isAuthenticated: boolean,
    public userId?: string,
    public isProfileComplete?: boolean
  ) {}

  static createUnauthenticated(): UserAuthState {
    return new UserAuthState(false);
  }

  static createAuthenticated(
    userId: string,
    isProfileComplete: boolean
  ): UserAuthState {
    return new UserAuthState(true, userId, isProfileComplete);
  }
}

class RouteHandler {
  private static isPublicRoute(pathname: string): boolean {
    return ROUTE_CONFIG.PUBLIC.some(path => pathname.startsWith(path));
  }

  private static isOnboardingRoute(pathname: string): boolean {
    return ROUTE_CONFIG.AUTH_ONLY.some(path => pathname.startsWith(path));
  }

  private static isProtectedRoute(pathname: string): boolean {
    return (
      ROUTE_CONFIG.PROTECTED.some(path => pathname.startsWith(path)) ||
      (!this.isPublicRoute(pathname) && !this.isOnboardingRoute(pathname))
    );
  }

  static async handleRouteAccess(
    pathname: string,
    userState: UserAuthState,
    request: NextRequest
  ): Promise<NextResponse | null> {
    // Rutas públicas: siempre permitidas
    if (this.isPublicRoute(pathname)) {
      // Si el usuario está autenticado y va a login/register, redirigir según onboarding
      if (
        userState.isAuthenticated &&
        (pathname.startsWith('/login') || pathname.startsWith('/register'))
      ) {
        const redirectUrl = userState.isProfileComplete
          ? '/home'
          : '/onboarding';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
      return null; // Permitir acceso
    }

    // Usuario no autenticado intentando acceder a rutas protegidas
    if (!userState.isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Usuario autenticado
    if (this.isOnboardingRoute(pathname)) {
      // Onboarding: solo accesible si NO tiene perfil completo
      if (userState.isProfileComplete) {
        return NextResponse.redirect(new URL('/home', request.url));
      }
      return null; // Permitir acceso a onboarding
    }

    if (this.isProtectedRoute(pathname)) {
      // Rutas protegidas: solo accesibles con perfil completo
      if (!userState.isProfileComplete) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
      return null; // Permitir acceso
    }

    return null; // Permitir acceso por defecto
  }
}

class TokenValidator {
  static extractToken(request: NextRequest): string | undefined {
    const supabaseAuthCookie = request.cookies
      .getAll()
      .find(cookie => cookie.name.endsWith('-auth-token'))?.value;

    if (!supabaseAuthCookie) return undefined;

    try {
      const parsed = JSON.parse(supabaseAuthCookie);
      return Array.isArray(parsed) ? parsed[0] : undefined;
    } catch {
      return undefined;
    }
  }

  static validateToken(token: string): JWTPayload | null {
    try {
      const decoded = jwtDecode<JWTPayload>(token);

      // Verificar expiración
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      // Verificar rol
      if (decoded.role !== 'authenticated') {
        return null;
      }

      return decoded;
    } catch {
      return null;
    }
  }
}

// Simple profile check that's Edge Runtime compatible
async function checkProfileCompletenessEdge(userId: string): Promise<boolean> {
  try {
    // In Edge Runtime, we'll be more conservative and assume profile is incomplete
    // The actual profile check will happen on the client side
    console.log('Edge Runtime: Assuming profile incomplete for safety');
    return false;
  } catch {
    return false;
  }
}

/**
 * Middleware principal para proteger rutas y manejar internacionalización
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    const { pathname } = request.nextUrl;

    // Aplicar middleware de internacionalización
    const response = intlMiddleware(request);

    // Configurar headers de cache
    response.headers.set('Vary', 'Accept-Language');
    response.headers.set('Cache-Control', 'private, no-cache, must-revalidate');

    // Extraer y validar token
    const accessToken = TokenValidator.extractToken(request);
    let userState: UserAuthState;

    if (!accessToken) {
      userState = UserAuthState.createUnauthenticated();
    } else {
      const tokenPayload = TokenValidator.validateToken(accessToken);

      if (!tokenPayload) {
        userState = UserAuthState.createUnauthenticated();
      } else {
        // En Edge Runtime, ser conservador con el check de perfil
        const isProfileComplete = await checkProfileCompletenessEdge(
          tokenPayload.sub
        );
        userState = UserAuthState.createAuthenticated(
          tokenPayload.sub,
          isProfileComplete
        );
      }
    }

    // Manejar acceso a rutas
    const routeResponse = await RouteHandler.handleRouteAccess(
      pathname,
      userState,
      request
    );

    return routeResponse || response;
  } catch (error) {
    console.error('Middleware error:', error);
    // En caso de error, continuar con el request normal
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y rutas API que no son parte del flujo de auth
    '/((?!_next/static|_next/image|favicon.ico|api/auth|api/reset-password|images|svgs|.*\\.png$|.*\\.svg$).*)'
  ]
};
