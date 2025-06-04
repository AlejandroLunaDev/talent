import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/auth/forgot-password/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Recuperar Contraseña | NoCountry',
  description: 'Recupera tu contraseña de NoCountry'
};

export default function ForgotPasswordPage() {
  return (
    <div className='min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 relative h-screen flex items-center justify-center text-gray-200'>
      <ForgotPasswordForm />
    </div>
  );
}
