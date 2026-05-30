import React from 'react';
import { cn } from '../../lib/utils/cn';
import { FileQuestion } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({
  className,
  title = 'Dosya Bulunamadı',
  description = 'Henüz herhangi bir dosya yüklemediniz veya işlem yapmadınız.',
  icon = <FileQuestion className="h-12 w-12 text-slate-300 stroke-[1.5]" />,
  action,
  ...props
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-slate-200 bg-white/50 py-12',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-4.5">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
