import { cn } from '@/shared/lib/utils/utils';
import { ReactNode } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface HeadingProps {
  children: ReactNode;
  as?: HeadingLevel;
  size?: HeadingSize;
  className?: string;
}

const sizeClasses: Record<HeadingSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl'
};

export function Heading({
  children,
  as = 'h2',
  size = 'xl',
  className
}: HeadingProps) {
  const Component = as;
  const sizeClass = sizeClasses[size];

  return (
    <Component className={cn('font-bold tracking-tight', sizeClass, className)}>
      {children}
    </Component>
  );
}
