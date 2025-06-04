'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useLanguageChange } from '@/shared/lib/hooks/useLanguageChange';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

type LanguageOption = {
  value: string;
  label: string;
  flag: string;
};

const languages: LanguageOption[] = [
  { value: 'en', label: 'English', flag: '/svgs/lang/en.svg' },
  { value: 'es', label: 'Español', flag: '/svgs/lang/es.svg' },
  { value: 'pt', label: 'Português', flag: '/svgs/lang/pt.svg' }
];

const LanguageSwitcher = () => {
  const locale = useLocale();
  const { changeLanguage, isChanging } = useLanguageChange();
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageOption | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lang = languages.find(lang => lang.value === locale) || languages[0];
    setSelectedLanguage(lang);
  }, [locale]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (selectedOption: LanguageOption) => {
    if (selectedOption.value !== locale) {
      document.cookie = `NEXT_LOCALE=${selectedOption.value}; path=/; max-age=31536000; SameSite=Lax`;
      changeLanguage(selectedOption.value);
      setSelectedLanguage(selectedOption);
    }
    setIsOpen(false);
  };

  if (!selectedLanguage) return null;

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className='flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-800 transition-colors duration-200 disabled:opacity-50'
      >
        <Image
          width={20}
          height={14}
          src={selectedLanguage.flag}
          alt={selectedLanguage.label}
          className='w-5 h-3.5 rounded-sm'
        />
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 py-2 w-32 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-50'>
          {languages.map(language => (
            <button
              key={language.value}
              onClick={() => handleLanguageChange(language)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-700 transition-colors duration-150 ${
                language.value === locale
                  ? 'text-blue-400 bg-slate-700/50'
                  : 'text-slate-300'
              }`}
            >
              <Image
                width={16}
                height={12}
                src={language.flag}
                alt={language.label}
                className='w-4 h-3 rounded-sm'
              />
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
