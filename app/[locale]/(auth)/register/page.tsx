import Register from '@/features/auth/register/register';
import { PublicRouteGuard } from '@/features/auth/components/RouteGuard';

export default function RegisterPage() {
  return (
    <PublicRouteGuard>
      <Register />
    </PublicRouteGuard>
  );
}
