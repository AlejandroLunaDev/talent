import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { Country } from '../lib/types';

interface CountrySelectProps {
  selectedCountry: Country | undefined;
  allCountries: Country[];
  onSelect: (countryCode: string) => void;
}

export function CountrySelect({
  selectedCountry,
  allCountries,
  onSelect
}: CountrySelectProps) {
  const t = useTranslations('auth.register.onboarding.step1');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleSelect = (countryCode: string) => {
    onSelect(countryCode);
    setIsSelectOpen(false);
  };

  return (
    <Select
      value={selectedCountry?.code || ''}
      onValueChange={handleSelect}
      open={isSelectOpen}
      onOpenChange={setIsSelectOpen}
    >
      <SelectTrigger className='w-[110px] bg-slate-800/50 border-slate-700 rounded-r-none flex items-center gap-2 text-white'>
        <div className='flex items-center gap-2 text-white'>
          {selectedCountry ? (
            <>
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.dial_code}</span>
            </>
          ) : (
            <span>--</span>
          )}
        </div>
      </SelectTrigger>
      <SelectContent className='max-h-[300px] overflow-y-auto bg-slate-800 border-slate-700 text-white'>
        <Command>
          <CommandInput
            placeholder={t('phone.searchCountry')}
            className='bg-slate-800/50 border-slate-700'
          />
          <CommandEmpty>{t('phone.noResults')}</CommandEmpty>
          <CommandGroup>
            {allCountries.map(country => (
              <CommandItem
                key={country.code}
                onSelect={() => handleSelect(country.code)}
                className='flex items-center gap-2 cursor-pointer hover:bg-slate-700'
              >
                <span>{country.flag}</span>
                <span>{country.name}</span>
                <span className='ml-auto text-slate-400'>
                  {country.dial_code}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </SelectContent>
    </Select>
  );
}
