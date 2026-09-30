import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  CheckCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';
import { cn } from '../../utils';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setSelectedTenderId } = useProcurement();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 z-10 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-900">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Procurement Alerts & Notices</h3>
              <p className="text-[11px] text-slate-500">Live system and compliance notifications</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsAsRead}
              className="p-1.5 text-xs text-blue-700 hover:bg-blue-50 rounded-lg font-semibold flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-8 h-8 mx-auto opacity-40 mb-2" />
              <p className="text-xs font-medium">No active notifications</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.tenderId) {
                    setSelectedTenderId(notif.tenderId);
                  }
                  if (notif.type === 'alert' || notif.type === 'warning') {
                    navigate('/alerts');
                  } else {
                    navigate('/compliance');
                  }
                  onClose();
                }}
                className={cn(
                  'p-3 rounded-xl transition-colors cursor-pointer flex items-start gap-3 text-xs',
                  notif.read ? 'bg-white hover:bg-slate-50 opacity-75' : 'bg-blue-50/50 hover:bg-blue-50 border border-blue-100/80 font-medium'
                )}
              >
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 flex-shrink-0 mt-0.5 shadow-2xs">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-slate-900 truncate">{notif.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  {notif.tenderId && (
                    <span className="inline-block mt-1.5 text-[10px] font-mono text-blue-700 bg-blue-100/60 px-1.5 py-0.2 rounded font-semibold">
                      {notif.tenderId}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 self-center" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
