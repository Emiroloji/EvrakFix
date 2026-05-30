import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge = ({ className, variant = 'primary', ...props }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all';
  
  const variants = {
    primary: 'bg-blue-50 text-blue-700 border border-blue-100',
    secondary: 'bg-slate-50 text-slate-700 border border-slate-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    error: 'bg-red-50 text-red-700 border border-red-100',
    info: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  };

  return <span className={cn(baseStyles, variants[variant], className)} {...props} />;
};

Badge.displayName = 'Badge';
