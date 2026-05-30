import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: React.ReactNode;
}

export const Alert = ({ className, variant = 'info', title, icon, children, ...props }: AlertProps) => {
  const variants = {
    info: 'bg-blue-50/75 text-blue-800 border-blue-100',
    success: 'bg-emerald-50/75 text-emerald-800 border-emerald-100',
    warning: 'bg-amber-50/75 text-amber-800 border-amber-100',
    error: 'bg-red-50/75 text-red-800 border-red-100',
  };

  const textColors = {
    info: 'text-blue-900',
    success: 'text-emerald-900',
    warning: 'text-amber-900',
    error: 'text-red-900',
  };

  return (
    <div
      className={cn(
        'flex gap-3 rounded-2xl border p-4.5 text-sm glass-panel',
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
      <div className="flex flex-col gap-1">
        {title && <span className={cn('font-semibold leading-none', textColors[variant])}>{title}</span>}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
};

Alert.displayName = 'Alert';
