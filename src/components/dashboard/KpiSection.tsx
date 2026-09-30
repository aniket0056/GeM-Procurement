import React from 'react';
import {
  FileSpreadsheet,
  Clock,
  CheckCheck,
  Percent,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const KpiSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Active Procurements"
        value="24"
        change="+12.4%"
        isPositive={true}
        subtext="vs last month"
        icon={FileSpreadsheet}
        iconBg="bg-blue-50"
        iconColor="text-blue-800"
      />

      <StatCard
        title="Bids Under Review"
        value="86"
        change="+5.2%"
        isPositive={true}
        subtext="Across 6 PSUs"
        icon={Clock}
        iconBg="bg-amber-50"
        iconColor="text-amber-800"
      />

      <StatCard
        title="Bids Verified"
        value="1,248"
        change="+18.7%"
        isPositive={true}
        subtext="YTD Verified"
        icon={CheckCheck}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-800"
      />

      <StatCard
        title="Compliance Rate"
        value="82.6%"
        change="+2.1%"
        isPositive={true}
        subtext="First-pass pass"
        icon={Percent}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-800"
      />

      <StatCard
        title="High-Risk Bids"
        value="14"
        change="-8.3%"
        isPositive={false}
        subtext="Flagged by AI"
        icon={ShieldAlert}
        iconBg="bg-rose-50"
        iconColor="text-rose-800"
      />

      <StatCard
        title="Processing Saved"
        value="428 hrs"
        change="+34.5%"
        isPositive={true}
        subtext="~18 days saved"
        icon={Zap}
        iconBg="bg-violet-50"
        iconColor="text-violet-800"
      />
    </div>
  );
};
