import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  CheckSquare,
  ShieldAlert,
  Users,
  FileText,
  History,
  Bot,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';
import { cn } from '../../utils';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { currentUser, unreadNotificationCount, riskAlerts } = useProcurement();
  const navigate = useNavigate();

  const activeAlertsCount = riskAlerts.filter(a => a.status === 'Active').length;

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Procurements', icon: FileSpreadsheet, path: '/procurements' },
    { label: 'Bid Verification', icon: CheckSquare, path: '/verification' },
    { label: 'Compliance Analysis', icon: ShieldCheck, path: '/compliance' },
    { label: 'Vendor Comparison', icon: Users, path: '/vendors' },
    { label: 'Risk & Alerts', icon: ShieldAlert, path: '/alerts', badge: activeAlertsCount > 0 ? activeAlertsCount : undefined, badgeColor: 'bg-rose-500' },
    { label: 'Reports', icon: FileText, path: '/reports' },
    { label: 'Audit Trail', icon: History, path: '/audit' },
    { label: 'AI Assistant', icon: Bot, path: '/copilot', highlight: true },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Top Brand Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 border border-blue-500/30 flex items-center justify-center text-white shadow-md shadow-blue-900/30 flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-200" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black tracking-tight text-white uppercase">GeM Compliance AI</h1>
            </div>
            <p className="text-[10px] font-medium text-slate-400 truncate">Ministry of Petroleum & Natural Gas</p>
          </div>
        </div>

        {/* PSU Badge */}
        <div className="mt-3 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            Enterprise Edition
          </span>
          <span className="text-[10px] bg-blue-900/80 text-blue-300 px-1.5 py-0.2 rounded font-mono font-semibold">
            MoPNG
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Platform Navigation
        </div>

        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                isActive
                  ? 'bg-blue-800 text-white shadow-sm shadow-blue-950/40 border border-blue-700'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
                item.highlight && !location.pathname.includes(item.path) && 'border border-blue-500/20 bg-blue-950/30 text-blue-200'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon
                    className={cn(
                      'w-4 h-4 flex-shrink-0 transition-colors',
                      isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'px-1.5 py-0.2 text-[10px] font-bold rounded-full text-white',
                        item.badgeColor || 'bg-blue-600'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200 opacity-80" />}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom User / Support Section */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-800/60 border border-blue-600/40 text-blue-200 flex items-center justify-center font-bold text-xs">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-blue-400 font-medium truncate">{currentUser.role}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs px-2 pt-1">
          <button
            onClick={() => navigate('/settings')}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5 text-[11px] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Support
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 text-[11px] transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};
