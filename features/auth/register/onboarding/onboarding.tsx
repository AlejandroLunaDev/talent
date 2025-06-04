'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from 'next';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/shared/ui';
import { OnboardingStep1Form } from './components/OnboardingStep1Form';
import { OnboardingStep2Form } from './components/OnboardingStep2Form';
import { OnboardingSummary } from './components/OnboardingSummary';
import { useOnboardingStore } from './lib/store/onboardingStore';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { OnboardingRouteGuard } from '@/features/auth/components/RouteGuard';

export default function Onboarding() {
  const router = useRouter();
  const t = useTranslations('auth.register.onboarding');
  const [currentStep, setCurrentStep] = useState(1);

  const { isLoading: isStepLoading } = useOnboardingStore();

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSuccess = () => {
    console.log('✅ Onboarding completed successfully!');
    router.push('/home' as Route);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1Form onSuccess={handleNextStep} />;
      case 2:
        return <OnboardingStep2Form onSuccess={handleNextStep} />;
      case 3:
        return <OnboardingSummary onSuccess={handleSuccess} />;
      default:
        return null;
    }
  };

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Dynamic container width based on step
  const getContainerWidth = () => {
    switch (currentStep) {
      case 3:
        return 'w-full max-w-6xl'; // Wider for summary
      default:
        return 'w-full max-w-md'; // Standard width for forms
    }
  };

  return (
    <OnboardingRouteGuard>
      <div className='min-h-screen text-white flex items-center justify-center bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 p-4'>
        <Card
          className={`${getContainerWidth()} border-gradient overflow-hidden transition-all duration-500`}
        >
          <CardHeader className='bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50'>
            <div className='flex items-center mb-2'>
              {currentStep > 1 && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 mr-2 text-slate-400'
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1 || isStepLoading}
                >
                  <ArrowLeft className='h-4 w-4' />
                </Button>
              )}
              <div className='w-full bg-slate-700/30 h-2 rounded-full overflow-hidden'>
                <div
                  className='bg-gradient-to-r from-[#FF1493] to-[#00BFFF] h-full transition-all duration-500 ease-out'
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className='flex justify-center mb-4'>
              <Image
                src='/images/nocountry-logo.png'
                alt='NoCountry'
                width={180}
                height={40}
              />
            </div>

            {currentStep !== 3 && (
              <CardDescription className='text-center'>
                {t(`step${currentStep}.description`)}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent
            className={`bg-gradient-to-br from-slate-900/80 to-slate-800/80 ${currentStep === 3 ? 'p-8' : 'p-6'}`}
          >
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </OnboardingRouteGuard>
  );
}
