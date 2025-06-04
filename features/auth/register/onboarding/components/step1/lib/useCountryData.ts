import { useState, useEffect, useMemo } from 'react';
import { Country, CountryListType } from './types';

// Countries from America and Europe (ISO 3166-1 alpha-2 codes)
const AMERICA_AND_EUROPE_COUNTRIES = [
  // América del Norte
  'US',
  'CA',
  'MX',

  // América Central
  'GT',
  'BZ',
  'SV',
  'HN',
  'NI',
  'CR',
  'PA',

  // América del Sur
  'AR',
  'BO',
  'BR',
  'CL',
  'CO',
  'EC',
  'GY',
  'PY',
  'PE',
  'SR',
  'UY',
  'VE',

  // Caribe
  'AG',
  'BS',
  'BB',
  'BZ',
  'CU',
  'DM',
  'DO',
  'GD',
  'HT',
  'JM',
  'KN',
  'LC',
  'VC',
  'TT',

  // Europa Occidental
  'AD',
  'AT',
  'BE',
  'CH',
  'DE',
  'DK',
  'ES',
  'FI',
  'FR',
  'GB',
  'GR',
  'IE',
  'IS',
  'IT',
  'LI',
  'LU',
  'MC',
  'MT',
  'NL',
  'NO',
  'PT',
  'SE',
  'SM',
  'VA',

  // Europa Central y Oriental
  'AL',
  'BA',
  'BG',
  'BY',
  'CZ',
  'EE',
  'HR',
  'HU',
  'LT',
  'LV',
  'MD',
  'ME',
  'MK',
  'PL',
  'RO',
  'RS',
  'SI',
  'SK',
  'UA',

  // Europa del Este (Rusia y países ex-soviéticos en Europa)
  'RU'
];

// Simple country data mapping
const COUNTRY_DATA: Record<
  string,
  { name: string; flag: string; dial_code: string }
> = {
  US: { name: 'United States', flag: '🇺🇸', dial_code: '+1' },
  CA: { name: 'Canada', flag: '🇨🇦', dial_code: '+1' },
  MX: { name: 'Mexico', flag: '🇲🇽', dial_code: '+52' },
  GT: { name: 'Guatemala', flag: '🇬🇹', dial_code: '+502' },
  BZ: { name: 'Belize', flag: '🇧🇿', dial_code: '+501' },
  SV: { name: 'El Salvador', flag: '🇸🇻', dial_code: '+503' },
  HN: { name: 'Honduras', flag: '🇭🇳', dial_code: '+504' },
  NI: { name: 'Nicaragua', flag: '🇳🇮', dial_code: '+505' },
  CR: { name: 'Costa Rica', flag: '🇨🇷', dial_code: '+506' },
  PA: { name: 'Panama', flag: '🇵🇦', dial_code: '+507' },
  AR: { name: 'Argentina', flag: '🇦🇷', dial_code: '+54' },
  BO: { name: 'Bolivia', flag: '🇧🇴', dial_code: '+591' },
  BR: { name: 'Brazil', flag: '🇧🇷', dial_code: '+55' },
  CL: { name: 'Chile', flag: '🇨🇱', dial_code: '+56' },
  CO: { name: 'Colombia', flag: '🇨🇴', dial_code: '+57' },
  EC: { name: 'Ecuador', flag: '🇪🇨', dial_code: '+593' },
  GY: { name: 'Guyana', flag: '🇬🇾', dial_code: '+592' },
  PY: { name: 'Paraguay', flag: '🇵🇾', dial_code: '+595' },
  PE: { name: 'Peru', flag: '🇵🇪', dial_code: '+51' },
  SR: { name: 'Suriname', flag: '🇸🇷', dial_code: '+597' },
  UY: { name: 'Uruguay', flag: '🇺🇾', dial_code: '+598' },
  VE: { name: 'Venezuela', flag: '🇻🇪', dial_code: '+58' },
  AG: { name: 'Antigua and Barbuda', flag: '🇦🇬', dial_code: '+1268' },
  BS: { name: 'Bahamas', flag: '🇧🇸', dial_code: '+1242' },
  BB: { name: 'Barbados', flag: '🇧🇧', dial_code: '+1246' },
  CU: { name: 'Cuba', flag: '🇨🇺', dial_code: '+53' },
  DM: { name: 'Dominica', flag: '🇩🇲', dial_code: '+1767' },
  DO: { name: 'Dominican Republic', flag: '🇩🇴', dial_code: '+1809' },
  GD: { name: 'Grenada', flag: '🇬🇩', dial_code: '+1473' },
  HT: { name: 'Haiti', flag: '🇭🇹', dial_code: '+509' },
  JM: { name: 'Jamaica', flag: '🇯🇲', dial_code: '+1876' },
  KN: { name: 'Saint Kitts and Nevis', flag: '🇰🇳', dial_code: '+1869' },
  LC: { name: 'Saint Lucia', flag: '🇱🇨', dial_code: '+1758' },
  VC: {
    name: 'Saint Vincent and the Grenadines',
    flag: '🇻🇨',
    dial_code: '+1784'
  },
  TT: { name: 'Trinidad and Tobago', flag: '🇹🇹', dial_code: '+1868' },
  AD: { name: 'Andorra', flag: '🇦🇩', dial_code: '+376' },
  AT: { name: 'Austria', flag: '🇦🇹', dial_code: '+43' },
  BE: { name: 'Belgium', flag: '🇧🇪', dial_code: '+32' },
  CH: { name: 'Switzerland', flag: '🇨🇭', dial_code: '+41' },
  DE: { name: 'Germany', flag: '🇩🇪', dial_code: '+49' },
  DK: { name: 'Denmark', flag: '🇩🇰', dial_code: '+45' },
  ES: { name: 'Spain', flag: '🇪🇸', dial_code: '+34' },
  FI: { name: 'Finland', flag: '🇫🇮', dial_code: '+358' },
  FR: { name: 'France', flag: '🇫🇷', dial_code: '+33' },
  GB: { name: 'United Kingdom', flag: '🇬🇧', dial_code: '+44' },
  GR: { name: 'Greece', flag: '🇬🇷', dial_code: '+30' },
  IE: { name: 'Ireland', flag: '🇮🇪', dial_code: '+353' },
  IS: { name: 'Iceland', flag: '🇮🇸', dial_code: '+354' },
  IT: { name: 'Italy', flag: '🇮🇹', dial_code: '+39' },
  LI: { name: 'Liechtenstein', flag: '🇱🇮', dial_code: '+423' },
  LU: { name: 'Luxembourg', flag: '🇱🇺', dial_code: '+352' },
  MC: { name: 'Monaco', flag: '🇲🇨', dial_code: '+377' },
  MT: { name: 'Malta', flag: '🇲🇹', dial_code: '+356' },
  NL: { name: 'Netherlands', flag: '🇳🇱', dial_code: '+31' },
  NO: { name: 'Norway', flag: '🇳🇴', dial_code: '+47' },
  PT: { name: 'Portugal', flag: '🇵🇹', dial_code: '+351' },
  SE: { name: 'Sweden', flag: '🇸🇪', dial_code: '+46' },
  SM: { name: 'San Marino', flag: '🇸🇲', dial_code: '+378' },
  VA: { name: 'Vatican City', flag: '🇻🇦', dial_code: '+39' },
  AL: { name: 'Albania', flag: '🇦🇱', dial_code: '+355' },
  BA: { name: 'Bosnia and Herzegovina', flag: '🇧🇦', dial_code: '+387' },
  BG: { name: 'Bulgaria', flag: '🇧🇬', dial_code: '+359' },
  BY: { name: 'Belarus', flag: '🇧🇾', dial_code: '+375' },
  CZ: { name: 'Czech Republic', flag: '🇨🇿', dial_code: '+420' },
  EE: { name: 'Estonia', flag: '🇪🇪', dial_code: '+372' },
  HR: { name: 'Croatia', flag: '🇭🇷', dial_code: '+385' },
  HU: { name: 'Hungary', flag: '🇭🇺', dial_code: '+36' },
  LT: { name: 'Lithuania', flag: '🇱🇹', dial_code: '+370' },
  LV: { name: 'Latvia', flag: '🇱🇻', dial_code: '+371' },
  MD: { name: 'Moldova', flag: '🇲🇩', dial_code: '+373' },
  ME: { name: 'Montenegro', flag: '🇲🇪', dial_code: '+382' },
  MK: { name: 'North Macedonia', flag: '🇲🇰', dial_code: '+389' },
  PL: { name: 'Poland', flag: '🇵🇱', dial_code: '+48' },
  RO: { name: 'Romania', flag: '🇷🇴', dial_code: '+40' },
  RS: { name: 'Serbia', flag: '🇷🇸', dial_code: '+381' },
  SI: { name: 'Slovenia', flag: '🇸🇮', dial_code: '+386' },
  SK: { name: 'Slovakia', flag: '🇸🇰', dial_code: '+421' },
  UA: { name: 'Ukraine', flag: '🇺🇦', dial_code: '+380' },
  RU: { name: 'Russia', flag: '🇷🇺', dial_code: '+7' }
};

// Simple CountryList implementation
const CountryList: CountryListType = {
  getAll: () => {
    return AMERICA_AND_EUROPE_COUNTRIES.map(code => ({
      name: COUNTRY_DATA[code]?.name || code,
      flag: COUNTRY_DATA[code]?.flag || '🏳️',
      code: code,
      dial_code: COUNTRY_DATA[code]?.dial_code || '+1'
    }));
  }
};

interface UseCountryDataReturn {
  allCountries: Country[];
  selectedCountry: Country | undefined;
  localSelectedCountryCode: string | null;
  setLocalSelectedCountryCode: (code: string) => void;
  handleCountrySelect: (
    countryCode: string,
    onSelect?: (country: Country) => void
  ) => void;
}

export function useCountryData(
  initialCountryCode: string | null,
  onCountryChange: (countryCode: string) => void
): UseCountryDataReturn {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [localSelectedCountryCode, setLocalSelectedCountryCode] = useState<
    string | null
  >(initialCountryCode);

  // Initialize countries data
  useEffect(() => {
    const countriesData: Country[] = CountryList.getAll();

    // Filter countries to only include America and Europe
    const filteredCountries = countriesData.filter(
      country =>
        country.code && AMERICA_AND_EUROPE_COUNTRIES.includes(country.code)
    );

    // Deduplicate countries
    const uniqueCountries = filteredCountries.reduce((acc, current) => {
      if (
        current.code &&
        current.dial_code &&
        !acc.find(item => item.code === current.code)
      ) {
        acc.push(current);
      }
      return acc;
    }, [] as Country[]);

    uniqueCountries.sort((a, b) => a.name.localeCompare(b.name));
    setAllCountries(uniqueCountries);

    // Set default country if none selected
    if (!initialCountryCode && uniqueCountries.length > 0) {
      const defaultCountry =
        uniqueCountries.find(country => country.code === 'AR') ||
        uniqueCountries.find(country => country.code === 'US') ||
        uniqueCountries.find(country => country.code === 'ES') ||
        uniqueCountries[0];

      setLocalSelectedCountryCode(defaultCountry.code);
      onCountryChange(defaultCountry.code);
    } else if (initialCountryCode) {
      setLocalSelectedCountryCode(initialCountryCode);
    }
  }, [initialCountryCode, onCountryChange]);

  // Find selected country
  const selectedCountry = useMemo(() => {
    return allCountries.find(
      country => country.code === localSelectedCountryCode
    );
  }, [localSelectedCountryCode, allCountries]);

  // Handle country selection
  const handleCountrySelect = (
    countryCode: string,
    onSelect?: (country: Country) => void
  ) => {
    if (countryCode === localSelectedCountryCode) return;

    const newSelectedCountry = allCountries.find(c => c.code === countryCode);
    if (newSelectedCountry) {
      setLocalSelectedCountryCode(countryCode);
      onCountryChange(countryCode);
      onSelect?.(newSelectedCountry);
    }
  };

  return {
    allCountries,
    selectedCountry,
    localSelectedCountryCode,
    setLocalSelectedCountryCode,
    handleCountrySelect
  };
}
