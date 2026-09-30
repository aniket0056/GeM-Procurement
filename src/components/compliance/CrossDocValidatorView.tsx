import React from 'react';
import {
  VendorBid,
} from '../../types';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { cn } from '../../utils';

interface CrossDocValidatorViewProps {
  vendor: VendorBid;
}

export const CrossDocValidatorView: React.FC<CrossDocValidatorViewProps> = ({ vendor }) => {
  const validations = vendor.crossDocumentValidations || [];

  return (
    <div className="enterprise-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Cross-Document Entity & Financial Validation
            </h3>
            <p className="text-xs text-slate-500">
              Cross-matching legal identities, tax identifiers & financial turnover across multi-document packages
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md border border-blue-100">
          {validations.length} Parameters Cross-Checked
        </span>
      </div>

      {/* Cross Document Table */}
      <div className="overflow-x-auto">
        <table className="interactive-table">
          <thead>
            <tr>
              <th>Verified Parameter</th>
              <th>Document 1 Reference</th>
              <th>Document 2 Reference</th>
              <th>Validation Result</th>
              <th>Severity</th>
              <th>AI Verification Notes</th>
            </tr>
          </thead>
          <tbody>
            {validations.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                  All cross-document parameters verified consistent with zero discrepancies.
                </td>
              </tr>
            ) : (
              validations.map(val => {
                const isMismatch = val.status === 'Mismatch';
                return (
                  <tr
                    key={val.id}
                    className={cn('transition-colors', isMismatch && 'bg-rose-50/20')}
                  >
                    {/* Parameter */}
                    <td className="font-semibold text-slate-900 text-xs">
                      {val.parameter}
                    </td>

                    {/* Doc 1 */}
                    <td className="text-xs">
                      <p className="font-mono text-[11px] text-slate-500">{val.doc1Name}</p>
                      <p className="font-bold text-slate-800 mt-0.5">{val.doc1Value}</p>
                    </td>

                    {/* Doc 2 */}
                    <td className="text-xs">
                      <p className="font-mono text-[11px] text-slate-500">{val.doc2Name}</p>
                      <p className={cn('font-bold mt-0.5', isMismatch ? 'text-rose-700' : 'text-slate-800')}>
                        {val.doc2Value}
                      </p>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={val.status} size="sm" />
                    </td>

                    {/* Severity */}
                    <td>
                      <StatusBadge status={val.severity} size="sm" />
                    </td>

                    {/* Notes */}
                    <td className="text-xs text-slate-600 max-w-sm leading-relaxed">
                      {val.notes}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
