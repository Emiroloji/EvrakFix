import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer';
    
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow shadow-blue-600/10',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
      outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700',
      ghost: 'hover:bg-slate-100 text-slate-700',
      destructive: 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/10',
      white: 'bg-white hover:bg-slate-50 text-slate-800 shadow-sm border border-slate-100',
    };

    const sizes = {
      sm: 'h-9 px-3.5 text-xs',
      md: 'h-11 px-5 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-11 w-11 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
