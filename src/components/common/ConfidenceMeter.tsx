import React from 'react';
import { cn } from '../../utils';
import { Sparkles } from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: number; // 0 - 100
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  showLabel = true,
  className,
  size = 'md',
}) => {
  let color = 'bg-emerald-500';
  let textColor = 'text-emerald-700';

  if (confidence < 85) {
    color = 'bg-amber-500';
    textColor = 'text-amber-700';
  }
  if (confidence < 70) {
    color = 'bg-rose-500';
    textColor = 'text-rose-700';
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('bg-slate-100 rounded-full overflow-hidden flex-1', size === 'sm' ? 'h-1.5 w-16' : 'h-2 w-24')}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${confidence}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn('inline-flex items-center gap-1 font-mono font-semibold text-xs', textColor)}>
          <Sparkles className="w-3 h-3 opacity-70" />
          {confidence}%
        </span>
      )}
    </div>
  );
};
