import React, { useState } from 'react';
import {
  ComplianceCheck,
  VendorBid,
} from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Edit2,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { ExportService } from '../../services/exportService';
import { cn } from '../../utils';

interface ComplianceMatrixTableProps {
  vendor: VendorBid;
  checks: ComplianceCheck[];
  onOpenSplitViewer: (check: ComplianceCheck) => void;
  onOpenOverride: (check: ComplianceCheck) => void;
}

export const ComplianceMatrixTable: React.FC<ComplianceMatrixTableProps> = ({
  vendor,
  checks,
  onOpenSplitViewer,
  onOpenOverride,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = checks.filter(c => {
    let matchesStatus = true;
    if (activeFilter === 'Non-Compliant') matchesStatus = c.status === 'Non-Compliant' || c.status === 'Missing';
    else if (activeFilter === 'Compliant') matchesStatus = c.status === 'Compliant';
    else if (activeFilter === 'Review Required') matchesStatus = c.reviewerStatus === 'Review Required' || c.risk === 'High';

    const matchesSearch =
      c.clauseId.toLowerCase().includes(search.toLowerCase()) ||
      c.tenderRequirement.toLowerCase().includes(search.toLowerCase()) ||
      c.vendorResponse.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    ExportService.exportComplianceMatrixToCSV(vendor, checks);
  };

  return (
    <div className="enterprise-card overflow-hidden">
      {/* Matrix Controls */}
      <div className="p-4 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Clause-by-Clause Compliance Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated against tender specifications with automated evidence extraction
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            {['All', 'Non-Compliant', 'Compliant', 'Review Required'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  'px-2.5 py-1 rounded-md transition-colors',
                  activeFilter === f
                    ? 'bg-white text-blue-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-1.5 px-3"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="interactive-table">
          <thead>
            <tr>
              <th>Clause ID</th>
              <th className="min-w-[220px]">Tender Requirement</th>
              <th className="min-w-[200px]">Vendor Response</th>
              <th>Evidence Document</th>
              <th>AI Verification</th>
              <th>Confidence</th>
              <th>Risk</th>
              <th>Reviewer Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-slate-400 text-xs">
                  No compliance clauses match the selected filter.
                </td>
              </tr>
            ) : (
              filtered.map(c => {
                const isNonCompliant = c.status === 'Non-Compliant' || c.status === 'Missing';
                const isHighRisk = c.risk === 'High';

                return (
                  <tr
                    key={c.id}
                    className={cn(
                      'group transition-colors',
                      isNonCompliant && 'bg-rose-50/20',
                      c.reviewerStatus === 'Overridden' && 'bg-amber-50/20'
                    )}
                  >
                    {/* Clause Code */}
                    <td className="font-mono font-bold text-xs text-blue-900 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-blue-100/70 border border-blue-200">
                        {c.clauseId}
                      </span>
                    </td>

                    {/* Tender Requirement */}
                    <td className="text-xs">
                      <p className="font-semibold text-slate-800 line-clamp-2">{c.tenderRequirement}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 inline-block">
                        {c.category}
                      </span>
                    </td>

                    {/* Vendor Response */}
                    <td className="text-xs">
                      <p
                        className={cn(
                          'font-medium line-clamp-2',
                          isNonCompliant ? 'text-rose-900 font-semibold' : 'text-slate-700'
                        )}
                      >
                        {c.vendorResponse}
                      </p>
                      {c.variance && (
                        <span className="inline-block mt-1 text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                          Variance: {c.variance}
                        </span>
                      )}
                    </td>

                    {/* Evidence Document */}
                    <td className="text-xs whitespace-nowrap">
                      {c.evidenceDocument !== '—' ? (
                        <button
                          onClick={() => onOpenSplitViewer(c)}
                          className="inline-flex items-center gap-1.5 text-blue-800 hover:text-blue-950 font-medium hover:underline max-w-[160px] truncate"
                          title="Open in Document Viewer"
                        >
                          <FileText className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
                          <span className="truncate">{c.evidenceDocument}</span>
                        </button>
                      ) : (
                        <span className="text-rose-600 font-medium text-xs">Document not found</span>
                      )}
                      {c.pageNumber > 0 && (
                        <div className="text-[10px] text-slate-500 font-mono">Page {c.pageNumber}</div>
                      )}
                    </td>

                    {/* AI Verification Status */}
                    <td>
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    {/* Confidence */}
                    <td>
                      <ConfidenceMeter confidence={c.confidence} size="sm" />
                    </td>

                    {/* Risk Level */}
                    <td>
                      <StatusBadge status={c.risk} size="sm" />
                    </td>

                    {/* Reviewer Status */}
                    <td className="text-xs font-semibold whitespace-nowrap">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[11px]',
                          c.reviewerStatus === 'Approved' && 'bg-emerald-100 text-emerald-800',
                          c.reviewerStatus === 'Review Required' && 'bg-rose-100 text-rose-800',
                          c.reviewerStatus === 'Overridden' && 'bg-purple-100 text-purple-800',
                          c.reviewerStatus === 'Clarification Requested' && 'bg-amber-100 text-amber-800',
                          c.reviewerStatus === 'Pending Review' && 'bg-slate-100 text-slate-700'
                        )}
                      >
                        {c.reviewerStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenSplitViewer(c)}
                          className="p-1.5 rounded-lg text-blue-800 hover:bg-blue-100/70 transition-colors"
                          title="View Document & AI Explanation"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenOverride(c)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Human Review & Override"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
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
