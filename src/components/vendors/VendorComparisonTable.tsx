import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VendorBid,
  Tender,
} from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { ExportService } from '../../services/exportService';
import {
  Users,
  Download,
  Eye,
  CheckSquare,
  AlertTriangle,
  Building,
  FileSpreadsheet,
} from 'lucide-react';
import { formatINR, cn } from '../../utils';

interface VendorComparisonTableProps {
  tender: Tender;
  vendors: VendorBid[];
  onSelectVendor: (vendorId: string) => void;
}

export const VendorComparisonTable: React.FC<VendorComparisonTableProps> = ({
  tender,
  vendors,
  onSelectVendor,
}) => {
  const navigate = useNavigate();

  const handleExportCSV = () => {
    ExportService.exportVendorComparisonToCSV(tender, vendors);
  };

  const handleInspect = (vendorId: string) => {
    onSelectVendor(vendorId);
    navigate('/compliance');
  };

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="enterprise-card overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Vendor Bid Compliance Comparative Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Evaluating {vendors.length} competing bidder submissions for GeM Bid {tender.gemBidNumber}
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-1.5 px-3"
            title="Download CSV Evaluation Matrix"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Comparison (CSV)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="interactive-table">
            <thead>
              <tr>
                <th>Vendor / Bidder</th>
                <th className="text-center">Compliance Score</th>
                <th className="text-center">Technical</th>
                <th className="text-center">Documents</th>
                <th className="text-center">Financial</th>
                <th className="text-center">Risk Level</th>
                <th className="text-center">Missing Req.</th>
                <th>AI Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v.id} className="group transition-colors">
                  {/* Vendor Name */}
                  <td>
                    <div className="font-bold text-slate-900 text-xs group-hover:text-blue-900 transition-colors">
                      {v.vendorName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {v.gemVendorId} • Quoted: {formatINR(v.financialDetails.quotedValue)}
                    </div>
                  </td>

                  {/* Compliance Score Gauge Pill */}
                  <td className="text-center">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center font-mono font-bold text-xs px-2.5 py-1 rounded-full',
                        v.overallComplianceScore >= 90
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : v.overallComplianceScore >= 80
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      )}
                    >
                      {v.overallComplianceScore}%
                    </span>
                  </td>

                  {/* Technical */}
                  <td className="text-center font-mono text-xs font-semibold text-slate-700">
                    {v.technicalComplianceScore}%
                  </td>

                  {/* Documents */}
                  <td className="text-center font-mono text-xs font-semibold text-slate-700">
                    {v.documentComplianceScore}%
                  </td>

                  {/* Financial */}
                  <td className="text-center font-mono text-xs font-semibold text-slate-700">
                    {v.financialComplianceScore}%
                  </td>

                  {/* Risk Level */}
                  <td className="text-center">
                    <StatusBadge status={v.riskLevel} size="sm" />
                  </td>

                  {/* Missing Requirements Count */}
                  <td className="text-center">
                    <span
                      className={cn(
                        'inline-block font-mono font-bold text-xs px-2 py-0.5 rounded',
                        v.missingDocumentsCount > 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-50 text-emerald-700'
                      )}
                    >
                      {v.missingDocumentsCount}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <StatusBadge status={v.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="text-right whitespace-nowrap">
                    <button
                      onClick={() => handleInspect(v.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold shadow-2xs transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Bid</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
