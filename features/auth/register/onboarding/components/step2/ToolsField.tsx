import { useState, useMemo } from 'react';
import { Input, Badge } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { FieldProps } from './lib/types';
import { TOOLS_OPTIONS } from './lib/constants';

interface ToolsFieldProps extends FieldProps {
  value: string[];
  onChange: (tools: string[]) => void;
}

export function ToolsField({
  value,
  onChange,
  error,
  onValidate
}: ToolsFieldProps) {
  const t = useTranslations('auth.register.onboarding.step2');
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!inputValue.trim() || inputValue.length < 2) return [];

    return TOOLS_OPTIONS.filter(
      tool =>
        tool.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(tool)
    ).slice(0, 8); // Limit to 8 suggestions
  }, [inputValue, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(newValue.length >= 2);
  };

  const addTool = (tool: string) => {
    const toolToAdd = tool.trim();
    if (toolToAdd && !value.includes(toolToAdd)) {
      const newTools = [...value, toolToAdd];
      onChange(newTools);
      onValidate('tools', newTools);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTool = (toolToRemove: string) => {
    const newTools = value.filter(tool => tool !== toolToRemove);
    onChange(newTools);
    onValidate('tools', newTools);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (suggestions.length > 0) {
        addTool(suggestions[0]); // Add first suggestion
      } else if (inputValue.trim()) {
        addTool(inputValue);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (tool: string) => {
    addTool(tool);
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
      <label className='text-sm font-medium'>{t('tools.label')}</label>

      <div className='relative'>
        <Input
          placeholder={t('tools.placeholder')}
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
            {suggestions.map(tool => (
              <button
                key={tool}
                type='button'
                className='w-full text-left px-3 py-2 hover:bg-slate-700 text-white text-sm border-b border-slate-700 last:border-b-0'
                onMouseDown={e => e.preventDefault()} // Prevent blur
                onClick={() => handleSuggestionClick(tool)}
              >
                {tool}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tools badges */}
      <div className='flex flex-wrap gap-2 mt-2'>
        {value.map(tool => (
          <Badge
            key={tool}
            variant='outline'
            className='border-[#FF1493] text-[#FF1493] bg-[#FF1493]/10'
          >
            {tool}
            <button
              type='button'
              onClick={() => removeTool(tool)}
              className='ml-1 text-[#FF1493]/70 hover:text-[#FF1493] focus:outline-none'
            >
              ×
            </button>
          </Badge>
        ))}
      </div>

      {error && (
        <p className='text-red-400 text-xs mt-1'>
          {t(error.message || 'Invalid tools')}
        </p>
      )}
    </div>
  );
}
