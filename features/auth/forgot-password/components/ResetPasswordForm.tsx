'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Eye, EyeOff, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Button, 
  Input, 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/shared/ui';

interface ResetPasswordFormProps {
  onSuccess?: () => void;
}

export function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const t = useTranslations('auth.resetPassword');
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Check if user is in password reset flow
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Redirect to forgot password if no session
        router.push('/forgot-password');
      }
    };
    checkSession();
  }, [supabase, router]);

  // Password strength validation
  const getPasswordStrength = (pwd: string) => {
    const requirements = {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    };
    const score = Object.values(requirements).filter(Boolean).length;
    return { requirements, score, isValid: score === 3 };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validations
    const newErrors: { [key: string]: string } = {};
    
    if (!password) {
      newErrors.password = t('password.error.required') || 'La nueva contraseña es obligatoria';
    } else if (!passwordStrength.isValid) {
      newErrors.password = t('password.error.requirements') || 'La contraseña no cumple los requisitos';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = t('confirmPassword.error.required') || 'La confirmación es obligatoria';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('confirmPassword.error.mismatch') || 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error('Error al restablecer la contraseña: ' + error.message);
        setIsLoading(false);
        return;
      }

      toast.success('Contraseña restablecida exitosamente');
      onSuccess?.();
      
      // Redirect to login after successful reset
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-gradient overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 p-10">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/nocountry-logo.png"
            alt="NoCountry"
            width={180}
            height={40}
          />
        </div>
        <CardTitle className="text-center text-2xl font-bold text-white">
          {t('title') || 'Restablecer contraseña'}
        </CardTitle>
        <CardDescription className="text-center text-gray-400">
          {t('description') || 'Ingresa tu nueva contraseña segura.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
              {t('password.label') || 'Nueva contraseña'}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('password.placeholder') || '••••••••'}
                className={`bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-10 ${
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-medium">
                  {t('password.requirements') || 'Requisitos:'}
                </p>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${passwordStrength.requirements.minLength ? 'text-green-400' : 'text-slate-500'}`}>
                    {passwordStrength.requirements.minLength ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {t('password.minLength') || 'Mínimo 8 caracteres'}
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordStrength.requirements.hasUppercase ? 'text-green-400' : 'text-slate-500'}`}>
                    {passwordStrength.requirements.hasUppercase ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {t('password.uppercase') || 'Al menos una mayúscula'}
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordStrength.requirements.hasSpecialChar ? 'text-green-400' : 'text-slate-500'}`}>
                    {passwordStrength.requirements.hasSpecialChar ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {t('password.specialChar') || 'Al menos un carácter especial'}
                  </div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200">
              {t('confirmPassword.label') || 'Confirmar contraseña'}
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('confirmPassword.placeholder') || '••••••••'}
                className={`bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-10 ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF1493] to-[#00BFFF] hover:from-[#FF1493]/90 hover:to-[#00BFFF]/90 text-white font-medium"
            disabled={isLoading || !password || !confirmPassword || !passwordStrength.isValid}
          >
            {isLoading ? (t('loading') || 'Restableciendo...') : (t('submit') || 'Restablecer contraseña')}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700/50 p-6 flex justify-center">
        <Link
          href="/login"
          className="text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200"
        >
          {t('backToLogin') || 'Volver al inicio de sesión'}
        </Link>
      </CardFooter>
    </Card>
  );
}
