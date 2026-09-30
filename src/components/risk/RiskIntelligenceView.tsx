import React, { useState } from 'react';
import {
  RiskAlert,
  VendorBid,
} from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  FileWarning,
  CheckCircle,
  XCircle,
  UserCheck,
  Check,
  Filter,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ScoreGauge } from '../common/ScoreGauge';
import { StatusBadge } from '../common/StatusBadge';
import { useProcurement } from '../../context/ProcurementContext';
import { cn } from '../../utils';

export const RiskIntelligenceView: React.FC = () => {
  const { riskAlerts, updateAlertStatus, currentUser, selectedVendor } = useProcurement();
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('Active');

  const filteredAlerts = riskAlerts.filter(a => {
    const matchesSeverity = filterSeverity === 'All' || a.severity === filterSeverity;
    const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchesSeverity && matchesStatus;
  });

  const handleAction = (alertId: string, status: 'Active' | 'Under Review' | 'Dismissed' | 'Resolved') => {
    updateAlertStatus(alertId, status, `Updated by ${currentUser.name} (${currentUser.role})`);
  };

  const highAlertsCount = riskAlerts.filter(a => a.severity === 'High' && a.status === 'Active').length;
  const underReviewCount = riskAlerts.filter(a => a.status === 'Under Review').length;
  const resolvedCount = riskAlerts.filter(a => a.status === 'Resolved' || a.status === 'Dismissed').length;

  return (
    <div className="space-y-6">
      {/* Top Composite Risk Intelligence Banner */}
      <div className="enterprise-card p-6 bg-gradient-to-r from-slate-900 to-slate-950 text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex-shrink-0">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  AI Procurement Risk & Fraud Intelligence
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-mono font-bold">
                  {highAlertsCount} High-Priority Signals
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Autonomous heuristic engine monitoring document forgery patterns, shell entity signals, pricing collusions, expired credentials, and statutory non-conformances across tender submissions.
              </p>
            </div>
          </div>

          {/* Aggregate Risk Gauge */}
          <div className="flex items-center gap-6 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <ScoreGauge
              score={selectedVendor?.riskScore || 28}
              size={110}
              strokeWidth={8}
              label="Risk Score"
              colorType={selectedVendor?.riskScore > 60 ? 'danger' : selectedVendor?.riskScore > 35 ? 'warning' : 'success'}
            />
            <div className="text-xs space-y-1">
              <p className="text-slate-400">Target Bidder:</p>
              <p className="font-bold text-white max-w-[140px] truncate">{selectedVendor?.vendorName}</p>
              <div className="pt-1">
                <StatusBadge status={selectedVendor?.riskLevel || 'Low'} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Risk Category Stats */}
        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Active High Priority:</span>{' '}
            <strong className="text-rose-400 font-mono text-sm ml-1">{highAlertsCount}</strong>
          </div>
          <div>
            <span className="text-slate-400">Under Review:</span>{' '}
            <strong className="text-amber-400 font-mono text-sm ml-1">{underReviewCount}</strong>
          </div>
          <div>
            <span className="text-slate-400">Resolved / Dismissed:</span>{' '}
            <strong className="text-emerald-400 font-mono text-sm ml-1">{resolvedCount}</strong>
          </div>
          <div>
            <span className="text-slate-400">Monitored Categories:</span>{' '}
            <strong className="text-blue-400 font-mono text-sm ml-1">9 Vectors</strong>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['Active', 'Under Review', 'Dismissed', 'Resolved', 'All'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                filterStatus === status
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Severity:</span>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="All">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low Severity</option>
          </select>
        </div>
      </div>

      {/* Alert Cards Grid */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="enterprise-card p-12 text-center text-slate-400 text-xs">
            <CheckCircle className="w-8 h-8 mx-auto text-emerald-600 mb-2 opacity-80" />
            <p className="font-semibold text-slate-700">No active risk alerts matching current filters</p>
            <p className="text-slate-400 text-[11px] mt-0.5">All monitored compliance parameters remain within verified tolerances.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isHigh = alert.severity === 'High';
            return (
              <div
                key={alert.id}
                className={cn(
                  'enterprise-card p-5 transition-all duration-200 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4',
                  isHigh ? 'border-l-4 border-l-rose-600 bg-rose-50/10' : 'border-l-4 border-l-amber-500 bg-white'
                )}
              >
                {/* Left Alert Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={alert.severity} size="sm" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                      {alert.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{alert.timestamp}</span>
                    {alert.clauseReference && (
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                        Ref: {alert.clauseReference}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                    {alert.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {alert.description}
                  </p>

                  <div className="pt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span>
                      Vendor: <strong className="text-slate-800">{alert.vendorName}</strong>
                    </span>
                    <span>•</span>
                    <span>Tender: <strong className="text-slate-800">{alert.tenderId}</strong></span>
                    {alert.assignedTo && (
                      <>
                        <span>•</span>
                        <span className="text-blue-800 font-semibold">Assigned: {alert.assignedTo}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  {alert.status === 'Active' && (
                    <>
                      <button
                        onClick={() => handleAction(alert.id, 'Under Review')}
                        className="btn-secondary text-xs py-1.5 px-3"
                        title="Assign to Self for Review"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                        <span>Assign Review</span>
                      </button>

                      <button
                        onClick={() => handleAction(alert.id, 'Resolved')}
                        className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700"
                        title="Mark Alert as Resolved"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>

                      <button
                        onClick={() => handleAction(alert.id, 'Dismissed')}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
                        title="Dismiss Alert"
                      >
                        Dismiss
                      </button>
                    </>
                  )}

                  {alert.status === 'Under Review' && (
                    <button
                      onClick={() => handleAction(alert.id, 'Resolved')}
                      className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Complete Review</span>
                    </button>
                  )}

                  {(alert.status === 'Resolved' || alert.status === 'Dismissed') && (
                    <button
                      onClick={() => handleAction(alert.id, 'Active')}
                      className="btn-secondary text-xs py-1.5 px-3 text-slate-600"
                    >
                      Reopen Alert
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
