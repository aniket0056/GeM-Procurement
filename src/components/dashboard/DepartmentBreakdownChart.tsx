import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Building2 } from 'lucide-react';
import { mockDepartmentStats } from '../../data/mockData';

export const DepartmentBreakdownChart: React.FC = () => {
  return (
    <div className="enterprise-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-900">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">PSU / Department Distribution</h3>
            <p className="text-[11px] text-slate-500">Compliance score by Petroleum Ministry enterprise</p>
          </div>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockDepartmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="department" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis domain={[60, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              formatter={(val: number) => [`${val}%`, 'Compliance Rate']}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '0.5rem',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="complianceRate" radius={[6, 6, 0, 0]}>
              {mockDepartmentStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.complianceRate >= 90 ? '#1e40af' : entry.complianceRate >= 80 ? '#3b82f6' : '#93c5fd'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
