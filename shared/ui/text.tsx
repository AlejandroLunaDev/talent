import { cn } from '@/shared/lib/utils/utils';
import { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export function Text({ children, className, as: Component = 'p' }: TextProps) {
  return (
    <Component className={cn('leading-7', className)}>{children}</Component>
  );
}
