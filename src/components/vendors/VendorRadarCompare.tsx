import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { VendorBid } from '../../types';
import { BarChart3 } from 'lucide-react';

interface VendorRadarCompareProps {
  vendors: VendorBid[];
}

export const VendorRadarCompare: React.FC<VendorRadarCompareProps> = ({ vendors }) => {
  const chartData = vendors.map(v => ({
    name: v.vendorName.split(' ')[0], // short name
    fullName: v.vendorName,
    Technical: v.technicalComplianceScore,
    Documents: v.documentComplianceScore,
    Financial: v.financialComplianceScore,
    Overall: v.overallComplianceScore,
  }));

  return (
    <div className="enterprise-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-900">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Multi-Dimensional Bid Compliance Benchmarks
            </h3>
            <p className="text-[11px] text-slate-500">
              Comparative scoring across Technical, Documentation, and Financial pillars
            </p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              formatter={(val: number, name: string) => [`${val}%`, name]}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '0.5rem',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="Technical" fill="#1e40af" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Documents" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Financial" fill="#0284c7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Overall" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
