import { useTranslations } from 'next-intl';
import { useCountryData } from '../lib/useCountryData';
import { usePhoneValidation } from '../lib/usePhoneValidation';
import { FieldProps } from '../lib/types';
import { CountrySelect } from './CountrySelect';
import { PhoneInput } from './PhoneInput';

interface PhoneFieldProps extends FieldProps {
  value: string;
  onChange: (value: string) => void;
  selectedCountryCode: string | null;
  onCountryChange: (countryCode: string) => void;
}

export function PhoneField({
  value,
  onChange,
  error,
  onValidate,
  selectedCountryCode,
  onCountryChange
}: PhoneFieldProps) {
  const t = useTranslations('auth.register.onboarding.step1');

  const { allCountries, selectedCountry, handleCountrySelect } = useCountryData(
    selectedCountryCode,
    onCountryChange
  );

  usePhoneValidation({
    phone: value,
    selectedCountry,
    validateField: onValidate
  });

  const handleCountrySelectWithValidation = (countryCode: string) => {
    handleCountrySelect(countryCode, newSelectedCountry => {
      if (value) {
        const cleanDialCode = newSelectedCountry.dial_code.replace(/\D/g, '');
        const fullPhoneNumber = `${cleanDialCode}${value}`;
        onValidate('phone', fullPhoneNumber);
      }
    });
  };

  return (
    <div className='space-y-2'>
      <label htmlFor='phone' className='text-sm font-medium'>
        {t('phone.label')}
      </label>
      <div className='flex'>
        <div className='flex items-start'>
          <CountrySelect
            selectedCountry={selectedCountry}
            allCountries={allCountries}
            onSelect={handleCountrySelectWithValidation}
          />
          <PhoneInput value={value} onChange={onChange} />
        </div>
      </div>
      {error && (
        <p className='text-red-400 text-xs mt-1'>
          {t(error.message || 'Invalid phone number')}
        </p>
      )}
    </div>
  );
}
