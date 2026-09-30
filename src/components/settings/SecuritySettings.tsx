import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Users,
  CheckCircle2,
  Clock,
  Database,
  FileCheck,
  Server,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';
import { RoleType } from '../../types';

export const SecuritySettings: React.FC = () => {
  const { currentUser, setCurrentUserRole } = useProcurement();
  const [isMfaEnabled, setIsMfaEnabled] = useState(true);
  const [isAuditLocked, setIsAuditLocked] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15');

  const rolesConfig: Array<{ role: RoleType; permissions: string[]; description: string }> = [
    {
      role: 'Procurement Officer',
      description: 'Full procurement authority to upload tenders, review AI findings, issue vendor clarifications, and approve compliance matrices.',
      permissions: ['Read/Write Tenders', 'Ingest Bid Packages', 'Execute AI Pipelines', 'Approve/Override Clauses', 'Generate Reports'],
    },
    {
      role: 'Technical Evaluator',
      description: 'Domain engineering review of technical specifications, operating envelopes, API/ASTM standards, and deviations.',
      permissions: ['Read Technical Bids', 'Perform Technical Overrides', 'Review Split Screen Evidence', 'Add Engineering Comments'],
    },
    {
      role: 'Financial Evaluator',
      description: 'Financial committee member evaluating BOQs, GST rates, arithmetic integrity, EMD validity, and price reasonability.',
      permissions: ['Inspect Financial Bids', 'Verify Arithmetic Integrity', 'Review Pricing Anomaly Alerts', 'Sign Commercial Clearances'],
    },
    {
      role: 'Audit Officer',
      description: 'Independent oversight inspecting immutable audit trails, cryptographic ledgers, and officer decision histories.',
      permissions: ['Read All Audit Logs', 'Verify SHA-256 Hashes', 'Export Integrity Reports', 'View Historical Timelines'],
    },
    {
      role: 'Administrator',
      description: 'System management, API endpoint orchestration, OCR engine calibration, and user identity federation.',
      permissions: ['System Configuration', 'User Provisioning', 'Engine Calibration', 'Security Parameter Tuning'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Security Status Header */}
      <div className="enterprise-card p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-800/80 text-blue-200 border border-blue-600/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Enterprise Procurement Security & Governance
              </h3>
              <p className="text-xs text-blue-200">
                Meets Ministry of Electronics & IT (MeitY) and GeM Tier-4 Security Benchmarks
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Security Guardrails Active
          </span>
        </div>
      </div>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Encryption at Rest & Transit */}
        <div className="enterprise-card p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Lock className="w-4 h-4 text-blue-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Cryptographic Encryption
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
              <div>
                <p className="font-semibold text-slate-800">Encryption at Rest</p>
                <p className="text-[11px] text-slate-500">AES-256-GCM hardware key protection</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px]">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
              <div>
                <p className="font-semibold text-slate-800">Encryption in Transit</p>
                <p className="text-[11px] text-slate-500">TLS 1.3 with Perfect Forward Secrecy</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px]">
                Enforced
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
              <div>
                <p className="font-semibold text-slate-800">Multi-Factor Authentication (MFA)</p>
                <p className="text-[11px] text-slate-500">e-Gov SAML 2.0 / Aadhaar OTP</p>
              </div>
              <button
                onClick={() => setIsMfaEnabled(prev => !prev)}
                className="text-blue-900 font-bold"
              >
                {isMfaEnabled ? <ToggleRight className="w-7 h-7 text-blue-800" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Audit & Compliance Governance */}
        <div className="enterprise-card p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Database className="w-4 h-4 text-indigo-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Governance & Retention Policies
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
              <div>
                <p className="font-semibold text-slate-800">Immutable Audit Logging (WORM)</p>
                <p className="text-[11px] text-slate-500">SHA-256 tamper-evident verification</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px]">
                Locked
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
              <div>
                <p className="font-semibold text-slate-800">Statutory Data Retention</p>
                <p className="text-[11px] text-slate-500">Mandatory Government 7-Year Rule</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono font-bold text-[11px]">
                7 Years
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
              <div>
                <p className="font-semibold text-slate-800">Inactivity Session Timeout</p>
                <p className="text-[11px] text-slate-500">Automatic logout on idle portal</p>
              </div>
              <select
                value={sessionTimeout}
                onChange={e => setSessionTimeout(e.target.value)}
                className="p-1 rounded border border-slate-300 text-xs font-medium"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix */}
      <div className="enterprise-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-900" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Role-Based Access Control Matrix (RBAC)
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Active User: <strong className="text-blue-900">{currentUser.name}</strong> ({currentUser.role})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rolesConfig.map(r => {
            const isActive = currentUser.role === r.role;
            return (
              <div
                key={r.role}
                className={`p-4 rounded-xl border transition-all ${
                  isActive ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-600/30 shadow-xs' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h5 className="font-bold text-xs text-slate-900">{r.role}</h5>
                  {isActive ? (
                    <span className="px-2 py-0.2 rounded-full bg-blue-900 text-white font-bold text-[10px]">
                      Current
                    </span>
                  ) : (
                    <button
                      onClick={() => setCurrentUserRole(r.role)}
                      className="text-[10px] font-semibold text-blue-700 hover:underline"
                    >
                      Switch Role
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">{r.description}</p>

                <div className="pt-2 border-t border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Granted Permissions:
                  </span>
                  {r.permissions.map((p, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5 text-[10px] text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
