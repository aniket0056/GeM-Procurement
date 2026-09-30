import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  ShieldCheck,
  Cpu,
  Database,
  Key,
  Globe,
  Sliders,
} from 'lucide-react';
import { SystemArchitectureDiagram } from '../components/settings/SystemArchitectureDiagram';
import { SecuritySettings } from '../components/settings/SecuritySettings';
import { cn } from '../utils';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'security' | 'engines'>('architecture');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            System Administration & Platform Architecture
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure OCR pipelines, AI model thresholds, security guardrails, and inspection topology
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('architecture')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap',
            activeTab === 'architecture'
              ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <Server className="w-4 h-4" />
          <span>System Architecture & Pipeline Flow</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap',
            activeTab === 'security'
              ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security, Encryption & RBAC</span>
        </button>

        <button
          onClick={() => setActiveTab('engines')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap',
            activeTab === 'engines'
              ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <Cpu className="w-4 h-4" />
          <span>AI & OCR Engine Configurations</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'architecture' && <SystemArchitectureDiagram />}

      {activeTab === 'security' && <SecuritySettings />}

      {activeTab === 'engines' && (
        <div className="space-y-4">
          <div className="enterprise-card p-6 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Neural OCR & Document Parser Engine
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">OCR Resolution Engine</span>
                <p className="text-slate-500 text-[11px]">
                  Configured with LayoutLMv3 + Tesseract OCR multi-threaded workers with PDF table extraction matrix.
                </p>
                <div className="pt-2 flex items-center justify-between font-mono text-[11px] text-blue-900">
                  <span>Engine Status: Active</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Online</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">LLM Verification Service</span>
                <p className="text-slate-500 text-[11px]">
                  Dual-pass semantic clause matching with deterministic mathematical variance verification.
                </p>
                <div className="pt-2 flex items-center justify-between font-mono text-[11px] text-blue-900">
                  <span>Model: GeM Procurement LLM v4.2</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Loaded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
