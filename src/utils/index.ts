import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2)} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'compliant':
    case 'technically compliant':
    case 'valid':
    case 'approved':
    case 'verified':
    case 'completed':
    case 'normal range':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badge: 'bg-emerald-500',
        text: 'text-emerald-700',
        ring: 'ring-emerald-600/20',
        fill: '#10b981',
      };
    case 'partially compliant':
    case 'under review':
    case 'review required':
    case 'pending review':
    case 'minor variation':
    case 'expiring soon':
    case 'medium':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        badge: 'bg-amber-500',
        text: 'text-amber-700',
        ring: 'ring-amber-600/20',
        fill: '#f59e0b',
      };
    case 'non-compliant':
    case 'expired':
    case 'missing':
    case 'mismatch':
    case 'high':
    case 'flagged':
    case 'unusually low bid (-32%)':
    case 'high bid deviation':
    case 'inconsistency detected':
    case 'deficient':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        badge: 'bg-rose-500',
        text: 'text-rose-700',
        ring: 'ring-rose-600/20',
        fill: '#ef4444',
      };
    case 'low':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        badge: 'bg-blue-500',
        text: 'text-blue-700',
        ring: 'ring-blue-600/20',
        fill: '#3b82f6',
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        badge: 'bg-slate-400',
        text: 'text-slate-700',
        ring: 'ring-slate-600/20',
        fill: '#64748b',
      };
  }
}

export function generateCryptoHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${Date.now().toString(16).slice(-8)}`;
}
