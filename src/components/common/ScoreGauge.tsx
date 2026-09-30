import React from 'react';
import { cn } from '../../utils';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showPercent?: boolean;
  className?: string;
  colorType?: 'auto' | 'success' | 'warning' | 'danger';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
  showPercent = true,
  className,
  colorType = 'auto',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let strokeColor = '#10b981'; // green
  if (colorType === 'auto') {
    if (score >= 90) strokeColor = '#10b981'; // emerald-500
    else if (score >= 75) strokeColor = '#f59e0b'; // amber-500
    else strokeColor = '#ef4444'; // rose-500
  } else if (colorType === 'warning') {
    strokeColor = '#f59e0b';
  } else if (colorType === 'danger') {
    strokeColor = '#ef4444';
  }

  return (
    <div className={cn('relative inline-flex flex-col items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {score}
          {showPercent && <span className="text-sm font-semibold text-slate-500">%</span>}
        </span>
        {label && <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</span>}
      </div>
      {sublabel && <span className="mt-1 text-xs text-slate-600 font-medium">{sublabel}</span>}
    </div>
  );
};
