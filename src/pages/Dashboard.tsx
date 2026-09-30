import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KpiSection } from '../components/dashboard/KpiSection';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { ComplianceDonutChart } from '../components/dashboard/ComplianceDonutChart';
import { DepartmentBreakdownChart } from '../components/dashboard/DepartmentBreakdownChart';
import { RecentProcurementsTable } from '../components/dashboard/RecentProcurementsTable';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import {
  PlusCircle,
  FileUp,
  CheckSquare,
  Bot,
  Sparkles,
  Building,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Header */}
      <div className="enterprise-card p-6 bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-enterprise">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-mono font-semibold">
              Ministry of Petroleum & Natural Gas
            </span>
            <span className="text-xs text-blue-300 font-mono">GeM Portal Gateway v4.2</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Procurement Intelligence Dashboard
          </h1>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl leading-relaxed">
            AI-assisted monitoring and compliance verification of procurement bids.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/new')}
            className="btn-primary bg-blue-800 hover:bg-blue-700 text-white border-0 shadow-md text-xs py-2 px-3.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Procurement</span>
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="btn-secondary text-xs py-2 px-3.5 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs"
          >
            <FileUp className="w-4 h-4 text-blue-300" />
            <span>Upload Vendor Bids</span>
          </button>
          <button
            onClick={() => navigate('/copilot')}
            className="btn-secondary text-xs py-2 px-3.5 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <KpiSection />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div>
          <ComplianceDonutChart />
        </div>
      </div>

      {/* Secondary Chart & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <DepartmentBreakdownChart />
        </div>
      </div>

      {/* Active Procurements Table */}
      <RecentProcurementsTable />

      {/* Statutory Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
