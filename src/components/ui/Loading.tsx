import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading = ({ className, size = 'md', text = 'İşleminiz yapılıyor...', ...props }: LoadingProps) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-14 w-14 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12', className)} {...props}>
      <div
        className={cn(
          'animate-spin rounded-full border-blue-600 border-t-transparent',
          sizes[size]
        )}
      />
      {text && <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
};

Loading.displayName = 'Loading';
