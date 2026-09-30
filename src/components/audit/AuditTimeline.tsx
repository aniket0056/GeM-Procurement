import React, { useState } from 'react';
import {
  AuditLog,
} from '../../types';
import {
  History,
  ShieldCheck,
  Download,
  Filter,
  Search,
  UserCheck,
  Cpu,
  Lock,
  Clock,
  FileText,
  Key,
} from 'lucide-react';
import { ExportService } from '../../services/exportService';
import { useProcurement } from '../../context/ProcurementContext';
import { cn } from '../../utils';

export const AuditTimeline: React.FC = () => {
  const { auditLogs } = useProcurement();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Ingestion', 'AI Extraction', 'Compliance Check', 'Human Review', 'Security', 'Override'];

  const filtered = auditLogs.filter(log => {
    const matchesCat = selectedCategory === 'All' || log.category === selectedCategory;
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.officer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExport = () => {
    ExportService.exportAuditLogsToCSV(filtered);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="enterprise-card p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-800/80 text-blue-200 border border-blue-600/50 flex-shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Cryptographically Verified Audit Trail
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Append-Only & Tamper-Proof
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Immutable chronological ledger recording all tender ingestions, AI inference cycles, clause extractions, and manual officer overrides with SHA-256 cryptographic hashes and session telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="btn-primary bg-blue-800 hover:bg-blue-700 text-white text-xs py-2 px-3.5 whitespace-nowrap shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors',
                selectedCategory === cat
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
          />
        </div>
      </div>

      {/* Timeline Card List */}
      <div className="enterprise-card p-6 bg-white">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
          {filtered.map((log, idx) => {
            const isAI = log.category === 'AI Extraction' || log.category === 'Compliance Check';
            const isHuman = log.category === 'Human Review' || log.category === 'Override';

            return (
              <div key={log.id} className="relative pl-6 group">
                {/* Node Icon Circle */}
                <div
                  className={cn(
                    'absolute -left-[17px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-2xs transition-transform group-hover:scale-110',
                    isAI
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : isHuman
                      ? 'bg-purple-50 border-purple-600 text-purple-700'
                      : 'bg-slate-50 border-slate-600 text-slate-700'
                  )}
                >
                  {isAI ? <Cpu className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </div>

                {/* Content Box */}
                <div className="bg-slate-50 hover:bg-blue-50/30 p-4 rounded-xl border border-slate-200/80 transition-colors space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-blue-950">
                        {log.timeFormatted}
                      </span>
                      <span className="text-slate-300">•</span>
                      <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                        {log.action}
                      </h4>
                      <span
                        className={cn(
                          'px-2 py-0.2 rounded-full text-[10px] font-bold',
                          isAI ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        )}
                      >
                        {log.category}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                      <Key className="w-2.5 h-2.5" />
                      {log.hash}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {log.details}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                    <div className="flex items-center gap-3">
                      <span>
                        Actor: <strong className="text-slate-700">{log.officer}</strong>
                      </span>
                      <span>•</span>
                      <span>Session: <strong className="text-slate-700 font-mono">{log.session}</strong></span>
                      <span>•</span>
                      <span>IP: <strong className="text-slate-700 font-mono">{log.ipAddress}</strong></span>
                    </div>

                    {log.documentRef && (
                      <span className="text-blue-800 font-semibold flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {log.documentRef}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
