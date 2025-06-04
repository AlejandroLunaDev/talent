'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/ui';
import { cn } from '@/shared/lib/utils/utils';
import { FieldError } from './lib/types';

interface Country {
  name: {
    common: string;
  };
  cca2: string;
  region: string;
  flag: string;
}

interface CountryFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: FieldError;
  onValidate?: (field: string, value: string) => void;
}

export function CountryField({
  value,
  onChange,
  error,
  onValidate
}: CountryFieldProps) {
  const t = useTranslations('auth.register.onboarding.step1');
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,cca2,region,flag'
        );
        const allCountries: Country[] = await response.json();

        // Filter for Americas and Europe only
        const filteredCountries = allCountries
          .filter(
            country =>
              country.region === 'Americas' || country.region === 'Europe'
          )
          .sort((a, b) => a.name.common.localeCompare(b.name.common));

        setCountries(filteredCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback countries if API fails
        setCountries([
          {
            name: { common: 'Argentina' },
            cca2: 'AR',
            region: 'Americas',
            flag: '🇦🇷'
          },
          {
            name: { common: 'España' },
            cca2: 'ES',
            region: 'Europe',
            flag: '🇪🇸'
          },
          {
            name: { common: 'Estados Unidos' },
            cca2: 'US',
            region: 'Americas',
            flag: '🇺🇸'
          },
          {
            name: { common: 'Brasil' },
            cca2: 'BR',
            region: 'Americas',
            flag: '🇧🇷'
          },
          {
            name: { common: 'Francia' },
            cca2: 'FR',
            region: 'Europe',
            flag: '🇫🇷'
          },
          {
            name: { common: 'Reino Unido' },
            cca2: 'GB',
            region: 'Europe',
            flag: '🇬🇧'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSelect = (selectedCountry: string) => {
    onChange(selectedCountry);
    onValidate?.('country', selectedCountry);
    setOpen(false);
  };

  const selectedCountry = countries.find(
    country => country.name.common === value
  );

  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium text-slate-200'>
        {t('country') || 'País'}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              'w-full justify-between bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-750 focus:border-blue-500 focus:ring-blue-500',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              !value && 'text-slate-400'
            )}
            disabled={isLoading}
          >
            {selectedCountry ? (
              <span className='flex items-center gap-2'>
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.name.common}</span>
              </span>
            ) : isLoading ? (
              t('loadingCountries') || 'Cargando países...'
            ) : (
              t('selectCountry') || 'Selecciona tu país'
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0 bg-slate-800 border-slate-700'>
          <Command className='bg-slate-800'>
            <CommandInput
              placeholder={t('searchCountries') || 'Buscar países...'}
              className='bg-slate-800 text-slate-100 placeholder-slate-400 border-slate-700'
            />
            <CommandList>
              <CommandEmpty className='text-slate-400 py-6 text-center text-sm'>
                {t('noCountriesFound') || 'No se encontraron países'}
              </CommandEmpty>

              {/* Selected country group - shown first */}
              {selectedCountry && (
                <>
                  <CommandGroup>
                    <CommandItem
                      key={`selected-${selectedCountry.cca2}`}
                      value={selectedCountry.name.common}
                      onSelect={() => handleSelect(selectedCountry.name.common)}
                      className='text-slate-100 hover:bg-gradient-to-r hover:from-[#FF1493]/20 hover:to-[#00BFFF]/20 data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-[#FF1493]/30 data-[selected=true]:to-[#00BFFF]/30 cursor-pointer transition-all duration-200'
                    >
                      <Check className='mr-2 h-4 w-4 text-[#FF1493] opacity-100' />
                      <span className='flex items-center gap-2'>
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.name.common}</span>
                      </span>
                    </CommandItem>
                  </CommandGroup>
                  {countries.filter(country => country.name.common !== value)
                    .length > 0 && (
                    <div className='h-px bg-slate-700 mx-2 my-1' />
                  )}
                </>
              )}

              {/* Rest of countries */}
              <CommandGroup>
                {countries
                  .filter(country => country.name.common !== value)
                  .map(country => (
                    <CommandItem
                      key={country.cca2}
                      value={country.name.common}
                      onSelect={() => handleSelect(country.name.common)}
                      className='text-slate-100 hover:bg-gradient-to-r hover:from-[#FF1493]/20 hover:to-[#00BFFF]/20 data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-[#FF1493]/30 data-[selected=true]:to-[#00BFFF]/30 cursor-pointer transition-all duration-200'
                    >
                      <Check className='mr-2 h-4 w-4 text-[#FF1493] opacity-0' />
                      <span className='flex items-center gap-2'>
                        <span>{country.flag}</span>
                        <span>{country.name.common}</span>
                      </span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className='text-sm text-red-400 flex items-center gap-1'>
          <span className='text-red-400'>⚠</span>
          {t(error.message) || error.message}
        </p>
      )}
    </div>
  );
}
