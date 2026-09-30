import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { cn } from '../../utils';

interface DisclaimerBannerProps {
  className?: string;
  variant?: 'info' | 'compact';
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  className,
  variant = 'info',
}) => {
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600',
          className
        )}
      >
        <ShieldAlert className="w-4 h-4 text-blue-800 flex-shrink-0" />
        <span>
          <strong className="text-slate-800">Notice:</strong> AI-generated findings are decision-support recommendations. Final procurement evaluation and approval remain the responsibility of authorized procurement officials.
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 flex items-start gap-3 shadow-sm',
        className
      )}
    >
      <div className="p-1.5 bg-blue-100 text-blue-900 rounded-lg flex-shrink-0 mt-0.5">
        <Info className="w-4 h-4" />
      </div>
      <div className="text-xs text-blue-950 leading-relaxed">
        <p className="font-semibold text-blue-900">Procurement Decision Support System Disclaimer</p>
        <p className="mt-0.5 text-blue-800">
          AI-generated findings are decision-support recommendations. Final procurement evaluation and approval remain the responsibility of authorized procurement officials under GeM General Terms & Conditions (GTC) and Ministry Guidelines.
        </p>
      </div>
    </div>
  );
};
