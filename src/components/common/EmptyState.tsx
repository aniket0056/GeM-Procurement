import React from 'react';
import { LucideIcon, FileQuestion, AlertCircle, FolderSearch } from 'lucide-react';
import { cn } from '../../utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = FolderSearch,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'enterprise-card p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 mb-4 shadow-sm">
        <Icon className="w-8 h-8 opacity-80" />
      </div>
      <h3 className="text-base font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary mt-5 text-xs">
          {actionText}
        </button>
      )}
    </div>
  );
};
