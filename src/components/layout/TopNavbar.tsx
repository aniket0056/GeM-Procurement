import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Activity,
  Shield,
  UserCheck,
  ChevronDown,
  Building,
  Sparkles,
  Command,
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';
import { RoleType } from '../../types';

interface TopNavbarProps {
  onOpenNotifications: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    setCurrentUserRole,
    tenders,
    selectedTenderId,
    setSelectedTenderId,
    unreadNotificationCount,
    toggleSearchModal,
  } = useProcurement();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isTenderDropdownOpen, setIsTenderDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const tenderDropdownRef = useRef<HTMLDivElement>(null);

  const availableRoles: RoleType[] = [
    'Procurement Officer',
    'Technical Evaluator',
    'Financial Evaluator',
    'Audit Officer',
    'Administrator',
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (tenderDropdownRef.current && !tenderDropdownRef.current.contains(event.target as Node)) {
        setIsTenderDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTender = tenders.find(t => t.id === selectedTenderId) || tenders[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-2.5 shadow-sm flex items-center justify-between">
      {/* Left: Global Quick Tender Selector & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Tender Selector */}
        <div className="relative" ref={tenderDropdownRef}>
          <button
            onClick={() => setIsTenderDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-xs font-semibold text-slate-800 transition-colors shadow-xs"
          >
            <Building className="w-3.5 h-3.5 text-blue-700" />
            <span className="max-w-[180px] truncate">{selectedTender?.department}: {selectedTender?.gemBidNumber}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isTenderDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Active GeM Tender
              </div>
              {tenders.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTenderId(t.id);
                    setIsTenderDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${
                    t.id === selectedTenderId ? 'bg-blue-50/70 text-blue-900 font-bold border-l-2 border-blue-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t.gemBidNumber}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 font-mono text-slate-600">
                      {t.department}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 truncate mt-0.5">{t.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar (Trigger) */}
        <div
          onClick={() => toggleSearchModal(true)}
          className="flex-1 max-w-md flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-400 cursor-pointer transition-all hover:border-slate-300"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 truncate">Search tenders, vendor bids, clauses, certificates...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white text-[10px] font-mono text-slate-500 border border-slate-200 shadow-xs">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>
      </div>

      {/* Right: AI Status, Notifications, Role Switcher */}
      <div className="flex items-center gap-3.5">
        {/* System Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium tracking-tight">AI Verification Engine Online</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
          title="Open Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* Officer Role Switcher Dropdown */}
        <div className="relative" ref={roleDropdownRef}>
          <button
            onClick={() => setIsRoleDropdownOpen(prev => !prev)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-blue-700 font-semibold mt-0.5">{currentUser.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                <p className="text-[10px] text-blue-700 font-mono mt-0.5 font-semibold">Badge: {currentUser.badgeNumber}</p>
              </div>

              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Operational Role (RBAC)
              </div>

              {availableRoles.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentUserRole(r);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentUser.role === r ? 'text-blue-900 font-bold bg-blue-50/70' : 'text-slate-700'
                  }`}
                >
                  <span>{r}</span>
                  {currentUser.role === r && <Shield className="w-3.5 h-3.5 text-blue-700" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
