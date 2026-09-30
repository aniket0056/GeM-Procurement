import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { SearchModal } from './SearchModal';
import { NotificationDrawer } from './NotificationDrawer';
import { Bot, ChevronRight, Home, Shield } from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';

export const AppLayout: React.FC = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTender } = useProcurement();

  // Generate breadcrumbs from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageTitleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    procurements: 'Procurements',
    new: 'Create Procurement',
    verification: 'Bid Verification',
    upload: 'Bid Submission Ingestion',
    compliance: 'Compliance Analysis',
    vendors: 'Vendor Comparison',
    alerts: 'Risk & Alerts',
    reports: 'Evaluation Reports',
    audit: 'Immutable Audit Trail',
    copilot: 'Compliance Copilot',
    settings: 'Settings & Security',
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Top Navbar */}
        <TopNavbar onOpenNotifications={() => setIsNotificationsOpen(true)} />

        {/* Breadcrumb Header Bar */}
        <div className="bg-white/80 border-b border-slate-200/60 px-6 py-2 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 text-slate-600 hover:text-blue-900 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal</span>
            </button>
            {pathParts.map((part, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className={idx === pathParts.length - 1 ? 'font-semibold text-slate-900 truncate' : 'text-slate-600 truncate'}>
                  {pageTitleMap[part] || part}
                </span>
              </React.Fragment>
            ))}
          </div>

          {selectedTender && (
            <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-blue-700" />
              <span>Active Scope: <strong className="text-slate-800">{selectedTender.gemBidNumber}</strong> ({selectedTender.department})</span>
            </div>
          )}
        </div>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/60">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Assistant Quick Trigger (if not already on /copilot page) */}
      {location.pathname !== '/copilot' && (
        <button
          onClick={() => navigate('/copilot')}
          className="fixed bottom-6 right-6 z-40 bg-blue-900 hover:bg-blue-950 text-white p-3.5 rounded-full shadow-2xl border-2 border-blue-600/40 flex items-center gap-2 group transition-all duration-200 hover:scale-105 active:scale-95"
          title="Open Compliance Copilot"
        >
          <Bot className="w-5 h-5 text-blue-300 animate-pulse" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pr-1">
            Compliance Copilot
          </span>
        </button>
      )}

      {/* Spotlight Search Modal */}
      <SearchModal />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};
