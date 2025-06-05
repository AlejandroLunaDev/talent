import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ProfileService } from '@/features/auth/lib/utils/dev-config';

/**
 * Página de inicio - ENTERPRISE VERSION
 * Server Component optimizado que usa tu ProfileService existente
 * Verificación server-side para mejor performance
 */
export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Verificar sesión server-side
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    // Si no hay sesión, ir directo a login
    if (!session?.user || sessionError) {
      redirect('/login');
    }

    // Usar tu ProfileService existente para verificar completitud
    const isProfileComplete = await ProfileService.checkCompleteness(
      session.user.id
    );

    // Redirigir según estado usando tu lógica existente
    if (!isProfileComplete) {
      redirect('/onboarding');
    } else {
      redirect('/home');
    }
  } catch (error) {
    console.error('Error in root page:', error);
    redirect('/login');
  }
}
