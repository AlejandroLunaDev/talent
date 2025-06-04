import { Metadata } from 'next';
import { ResetPasswordForm } from '@/features/auth/forgot-password/components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Restablecer Contraseña | NoCountry',
  description: 'Restablece tu contraseña de NoCountry'
};

export default function ResetPasswordPage() {
  return (
    <div className='min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 relative h-screen flex items-center justify-center text-gray-200'>
      <ResetPasswordForm />
    </div>
  );
}
