import { useState, useMemo } from 'react';
import { Input, Badge } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { FieldProps } from './lib/types';
import { TECH_SKILLS } from './lib/constants';

interface SkillsFieldProps extends FieldProps {
  value: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsField({
  value,
  onChange,
  error,
  onValidate
}: SkillsFieldProps) {
  const t = useTranslations('auth.register.onboarding.step2');
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!inputValue.trim() || inputValue.length < 2) return [];

    return TECH_SKILLS.filter(
      skill =>
        skill.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(skill)
    ).slice(0, 8); // Limit to 8 suggestions
  }, [inputValue, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(newValue.length >= 2);
  };

  const addSkill = (skill: string) => {
    const skillToAdd = skill.trim();
    if (skillToAdd && !value.includes(skillToAdd)) {
      const newSkills = [...value, skillToAdd];
      onChange(newSkills);
      onValidate('skills', newSkills);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = value.filter(skill => skill !== skillToRemove);
    onChange(newSkills);
    onValidate('skills', newSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (suggestions.length > 0) {
        addSkill(suggestions[0]); // Add first suggestion
      } else if (inputValue.trim()) {
        addSkill(inputValue);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (skill: string) => {
    addSkill(skill);
  };

  const handleFocus = () => {
    setShowSuggestions(inputValue.length >= 2);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>{t('skills.label')}</label>

      <div className='relative'>
        <Input
          placeholder={t('skills.placeholder')}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className='bg-slate-800/50 border-slate-700'
        />

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className='absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg max-h-48 overflow-y-auto'>
            {suggestions.map(skill => (
              <button
                key={skill}
                type='button'
                className='w-full text-left px-3 py-2 hover:bg-slate-700 text-white text-sm border-b border-slate-700 last:border-b-0'
                onMouseDown={e => e.preventDefault()} // Prevent blur
                onClick={() => handleSuggestionClick(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Skills badges */}
      <div className='flex flex-wrap gap-2 mt-2'>
        {value.map(skill => (
          <Badge
            key={skill}
            variant='outline'
            className='border-[#00BFFF] text-[#00BFFF] bg-[#00BFFF]/10'
          >
            {skill}
            <button
              type='button'
              onClick={() => removeSkill(skill)}
              className='ml-1 text-[#00BFFF]/70 hover:text-[#00BFFF] focus:outline-none'
            >
              ×
            </button>
          </Badge>
        ))}
      </div>

      {error && (
        <p className='text-red-400 text-xs mt-1'>
          {t(error.message || 'Invalid skills')}
        </p>
      )}
    </div>
  );
}
