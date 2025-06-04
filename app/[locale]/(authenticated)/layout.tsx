// app/(dashboard)/layout.tsx
import Header from '@/shared/layout/header/header';
import { Sidebar } from '@/shared/layout/sidebar/sidebar';
import { AuthenticatedRouteGuard } from '@/features/auth/components/RouteGuard';

/**
 * Layout para rutas que requieren usuario autenticado con onboarding completo
 */
export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedRouteGuard>
      <div className='flex text-[#fff] h-screen min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:bg-slate-900 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800'>
        <Sidebar />
        <main className='flex-1 overflow-auto bg-background'>
          <Header />
          {children}
        </main>
      </div>
    </AuthenticatedRouteGuard>
  );
}
