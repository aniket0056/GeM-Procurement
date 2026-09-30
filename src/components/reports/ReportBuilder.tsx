import React, { useState } from 'react';
import {
  Tender,
  VendorBid,
} from '../../types';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Building,
  ShieldCheck,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { ExportService } from '../../services/exportService';
import { formatINR, cn } from '../../utils';

interface ReportBuilderProps {
  tender: Tender;
  vendors: VendorBid[];
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({ tender, vendors }) => {
  const [reportType, setReportType] = useState<string>('Bid Compliance Report');
  const [includeAIExplainability, setIncludeAIExplainability] = useState<boolean>(true);
  const [includeAuditTrail, setIncludeAuditTrail] = useState<boolean>(true);
  const [includeFinancialMatrix, setIncludeFinancialMatrix] = useState<boolean>(true);

  const reportOptions = [
    'Bid Compliance Report',
    'Technical Evaluation Report',
    'Financial Validation Report',
    'Document Verification Report',
    'Vendor Comparison Report',
    'Risk Assessment Report',
    'Audit Report',
  ];

  const handlePrint = () => {
    ExportService.triggerPrint();
  };

  const handleExportCSV = () => {
    ExportService.exportVendorComparisonToCSV(tender, vendors);
  };

  return (
    <div className="space-y-6">
      {/* Report Customizer Controls (Hidden when printing) */}
      <div className="no-print enterprise-card p-5 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Generate AI-Assisted Evaluation Report
              </h3>
              <p className="text-xs text-slate-500">
                Official procurement documentation formatted for Ministry Tender Evaluation Committees
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="btn-secondary text-xs py-2 px-3.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary text-xs py-2 px-4 shadow-md shadow-blue-950/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save to PDF</span>
            </button>
          </div>
        </div>

        {/* Option Selectors */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Report Template:</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50 font-medium text-slate-800"
            >
              {reportOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="chk-ai"
              checked={includeAIExplainability}
              onChange={e => setIncludeAIExplainability(e.target.checked)}
              className="rounded text-blue-900 focus:ring-blue-600 h-4 w-4"
            />
            <label htmlFor="chk-ai" className="font-medium text-slate-700 cursor-pointer">
              Include AI Observations & Citations
            </label>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="chk-fin"
              checked={includeFinancialMatrix}
              onChange={e => setIncludeFinancialMatrix(e.target.checked)}
              className="rounded text-blue-900 focus:ring-blue-600 h-4 w-4"
            />
            <label htmlFor="chk-fin" className="font-medium text-slate-700 cursor-pointer">
              Include BOQ & EMD Breakdowns
            </label>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="chk-audit"
              checked={includeAuditTrail}
              onChange={e => setIncludeAuditTrail(e.target.checked)}
              className="rounded text-blue-900 focus:ring-blue-600 h-4 w-4"
            />
            <label htmlFor="chk-audit" className="font-medium text-slate-700 cursor-pointer">
              Attach Immutable Audit Log
            </label>
          </div>
        </div>
      </div>

      {/* Official Printable Report Document View */}
      <div className="enterprise-card bg-white p-8 md:p-12 shadow-enterprise text-slate-900 max-w-4xl mx-auto border border-slate-200">
        {/* Government Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5 text-blue-900" />
            Government of India • Ministry of Petroleum & Natural Gas
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
            {reportType}
          </h2>
          <p className="text-xs font-mono font-bold text-blue-900">
            GeM Bid Reference: {tender.gemBidNumber} • {tender.department}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Generated via GeM Compliance AI Platform on {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Tender Summary Grid */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block">Tender Title:</span>
            <strong className="text-slate-900">{tender.title}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Procuring Entity:</span>
            <strong className="text-blue-900">{tender.department} (MoPNG)</strong>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Sanctioned Value:</span>
            <strong className="text-slate-900 font-mono">{formatINR(tender.estimatedValue)}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">Total Submissions:</span>
            <strong className="text-slate-900 font-mono">{tender.totalBids} Bidders</strong>
          </div>
        </div>

        {/* Executive Summary Table */}
        <div className="my-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Executive Bid Compliance Evaluation Matrix
          </h4>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="p-2 border">Bidder Entity</th>
                <th className="p-2 border text-center">Score</th>
                <th className="p-2 border text-center">Technical</th>
                <th className="p-2 border text-center">Financial</th>
                <th className="p-2 border text-center">Risk</th>
                <th className="p-2 border">AI Evaluation Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(v => (
                <tr key={v.id} className="border-t">
                  <td className="p-2 border font-semibold">{v.vendorName}</td>
                  <td className="p-2 border text-center font-mono font-bold">{v.overallComplianceScore}%</td>
                  <td className="p-2 border text-center font-mono">{v.technicalComplianceScore}%</td>
                  <td className="p-2 border text-center font-mono">{v.financialComplianceScore}%</td>
                  <td className="p-2 border text-center">{v.riskLevel}</td>
                  <td className="p-2 border text-[11px] text-slate-600">{v.aiRecommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Flagged Issues & Deviations */}
        <div className="my-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Significant Non-Conformances & Deviations
          </h4>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Alpha Engineering Pvt Ltd — Clause TECH-04 (Operating Pressure)</span>
                <span className="text-amber-700 font-mono">Variance: -5 bar</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Offered continuous operating pressure is 145 bar versus 150 bar tender requirement. Marked for Offshore Engineering Committee review.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>PetroTech Solutions — Clause DOC-08 (OEM Authorization)</span>
                <span className="text-rose-700 font-mono">Document Missing</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Bidder is a non-OEM reseller and failed to submit tender-specific Manufacturer Authorization Form (MAF).
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Legal & Decision Disclaimer */}
        <div className="my-6 p-4 rounded-xl bg-slate-100 border border-slate-300 text-[11px] text-slate-700 leading-relaxed">
          <strong className="block text-slate-900 mb-0.5">Statutory Decision Support Disclaimer:</strong>
          This report represents automated compliance indexing synthesized by GeM Compliance AI. The automated findings serve as evidentiary assistance to the Tender Evaluation Committee. Final contract awards, technical qualifications, and commercial clearances remain under the statutory authority of authorized Ministry procurement officials.
        </div>

        {/* Signatures & Committee Endorsements */}
        <div className="mt-12 pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mb-2"></div>
            <p className="font-bold text-slate-900">Rajesh Kumar</p>
            <p className="text-[10px] text-slate-500">Senior Procurement Specialist (GeM L3)</p>
          </div>

          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mb-2"></div>
            <p className="font-bold text-slate-900">Dr. A. K. Sharma</p>
            <p className="text-[10px] text-slate-500">Chief General Manager (Technical)</p>
          </div>

          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mb-2"></div>
            <p className="font-bold text-slate-900">V. R. Narayanan</p>
            <p className="text-[10px] text-slate-500">Finance & Accounts Member</p>
          </div>
        </div>
      </div>
    </div>
  );
};
