import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const ComplianceDonutChart: React.FC = () => {
  const data = [
    { name: 'Compliant', value: 68, color: '#10b981', count: 848 },
    { name: 'Partially Compliant', value: 19, color: '#f59e0b', count: 237 },
    { name: 'Non-Compliant', value: 13, color: '#ef4444', count: 163 },
  ];

  const totalBids = 1248;

  return (
    <div className="enterprise-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Compliance Overview</h3>
              <p className="text-[11px] text-slate-500">Global evaluation breakdown</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
            {totalBids} Total Bids
          </span>
        </div>

        {/* Donut Chart with Centered Total */}
        <div className="relative h-48 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number, name: string) => [`${val}%`, name]}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-900 tracking-tight">87.0%</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avg Pass</span>
          </div>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-700 font-medium">Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-[11px]">848 bids</span>
            <span className="font-bold text-slate-900 font-mono">68%</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-slate-700 font-medium">Partially Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-[11px]">237 bids</span>
            <span className="font-bold text-slate-900 font-mono">19%</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span className="text-slate-700 font-medium">Non-Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono text-[11px]">163 bids</span>
            <span className="font-bold text-slate-900 font-mono">13%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
