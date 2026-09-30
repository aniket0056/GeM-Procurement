import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileSpreadsheet,
  Users,
  ShieldAlert,
  FileText,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    toggleSearchModal,
    tenders,
    currentVendors,
    currentRequirements,
    riskAlerts,
    setSelectedTenderId,
    setSelectedVendorId,
  } = useProcurement();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSearchModal();
      }
      if (e.key === 'Escape' && isSearchOpen) {
        toggleSearchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, toggleSearchModal]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredTenders = q
    ? tenders.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.gemBidNumber.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q)
      )
    : [];

  const filteredVendors = q
    ? currentVendors.filter(
        v =>
          v.vendorName.toLowerCase().includes(q) ||
          v.gemVendorId.toLowerCase().includes(q) ||
          v.gstin.toLowerCase().includes(q)
      )
    : [];

  const filteredClauses = q
    ? currentRequirements.filter(
        r =>
          r.clauseCode.toLowerCase().includes(q) ||
          r.requirement.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      )
    : [];

  const filteredAlerts = q
    ? riskAlerts.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.vendorName.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    filteredTenders.length > 0 ||
    filteredVendors.length > 0 ||
    filteredClauses.length > 0 ||
    filteredAlerts.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => toggleSearchModal(false)}
      />

      {/* Search Dialog Box */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tenders, vendors, clauses (e.g. TECH-04, 150 bar, ONGC)..."
            className="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded bg-white text-[10px] font-mono text-slate-500 border border-slate-200 shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 opacity-70" />
              </div>
              <p className="text-xs font-semibold text-slate-700">Enterprise AI Search</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1">
                Type keywords to instantly lookup tender clauses, vendor responses, financial benchmarks, or risk alerts.
              </p>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-xs font-medium">No matching records found for "{query}"</p>
            </div>
          ) : (
            <>
              {/* Tenders */}
              {filteredTenders.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Procurement Tenders ({filteredTenders.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredTenders.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTenderId(t.id);
                          toggleSearchModal(false);
                          navigate('/procurements');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileSpreadsheet className="w-4 h-4 text-blue-700 flex-shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-semibold text-slate-900 truncate">
                              {t.gemBidNumber}: {t.title}
                            </p>
                            <p className="text-[10px] text-slate-500">{t.department} • {t.status}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vendors */}
              {filteredVendors.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Vendor Bidders ({filteredVendors.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredVendors.map(v => (
                      <div
                        key={v.id}
                        onClick={() => {
                          setSelectedVendorId(v.id);
                          toggleSearchModal(false);
                          navigate('/compliance');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Users className="w-4 h-4 text-indigo-700 flex-shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-semibold text-slate-900 truncate">{v.vendorName}</p>
                            <p className="text-[10px] text-slate-500">
                              {v.gemVendorId} • Score: {v.overallComplianceScore}% • {v.status}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clauses */}
              {filteredClauses.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Extracted Clauses ({filteredClauses.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredClauses.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          toggleSearchModal(false);
                          navigate('/verification');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs text-blue-900">{c.clauseCode}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {c.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 truncate mt-0.5">{c.requirement}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Alerts */}
              {filteredAlerts.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Risk Intelligence Alerts ({filteredAlerts.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredAlerts.map(a => (
                      <div
                        key={a.id}
                        onClick={() => {
                          toggleSearchModal(false);
                          navigate('/alerts');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/70 border border-transparent hover:border-rose-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-semibold text-slate-900 truncate">{a.title}</p>
                            <p className="text-[10px] text-rose-700">{a.vendorName} • {a.severity} Priority</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
