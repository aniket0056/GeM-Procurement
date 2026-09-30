import React, { useState } from 'react';
import {
  ComplianceCheck,
  VendorBid,
} from '../../types';
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageSquare,
  Send,
  HelpCircle,
  RotateCcw,
  Check,
  X,
  FileSearch,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { useProcurement } from '../../context/ProcurementContext';
import { cn } from '../../utils';

interface SplitScreenViewerProps {
  check: ComplianceCheck;
  vendor: VendorBid;
  onClose: () => void;
}

export const SplitScreenViewer: React.FC<SplitScreenViewerProps> = ({
  check,
  vendor,
  onClose,
}) => {
  const { updateComplianceCheckOverride, currentUser } = useProcurement();

  const [currentPage, setCurrentPage] = useState<number>(check.pageNumber || 1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [overrideMode, setOverrideMode] = useState<boolean>(false);
  const [overrideAction, setOverrideAction] = useState<'Approved' | 'Rejected' | 'Overridden' | 'Clarification Requested'>('Approved');
  const [overrideRationale, setOverrideRationale] = useState<string>('');
  const [officerComment, setOfficerComment] = useState<string>('');
  const [isSuccessFeedback, setIsSuccessFeedback] = useState<boolean>(false);

  const isNonCompliant = check.status === 'Non-Compliant' || check.status === 'Missing';

  const handleSaveDecision = () => {
    if (!overrideRationale.trim()) {
      alert('Please provide a mandatory evaluation rationale for this decision.');
      return;
    }
    updateComplianceCheckOverride(
      vendor.id,
      check.id,
      overrideAction,
      overrideRationale,
      officerComment
    );
    setIsSuccessFeedback(true);
    setTimeout(() => {
      setIsSuccessFeedback(false);
      setOverrideMode(false);
    }, 1200);
  };

  return (
    <div className="enterprise-card overflow-hidden shadow-2xl border-slate-300">
      {/* Top Header Bar */}
      <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-800 text-blue-200">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                AI Compliance Verification & Document Audit
              </h3>
              <span className="px-2 py-0.5 rounded bg-blue-800 text-blue-200 text-xs font-mono font-bold">
                {check.clauseId}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Vendor: <strong className="text-white">{vendor.vendorName}</strong> | Evidence: {check.evidenceDocument}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Split View"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Split Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Side: Document Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-200/70 p-4 border-r border-slate-300 flex flex-col justify-between">
          {/* Document Viewer Toolbar */}
          <div className="bg-white/90 backdrop-blur-xs p-2 rounded-xl border border-slate-300/80 shadow-xs flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                {check.evidenceDocument}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Pagination */}
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-0.5 rounded hover:bg-white text-slate-600"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-slate-700 font-bold">
                  Page {currentPage} of {check.pageNumber > 0 ? check.pageNumber + 14 : 28}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-0.5 rounded hover:bg-white text-slate-600"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(80, prev - 10))}
                  className="p-0.5 rounded hover:bg-white text-slate-600"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] font-semibold text-slate-700 w-10 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                  className="p-0.5 rounded hover:bg-white text-slate-600"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Simulated PDF Document Canvas Page */}
          <div className="flex-1 bg-white rounded-xl shadow-md border border-slate-300 p-8 overflow-y-auto text-slate-800 font-serif leading-relaxed text-xs relative select-text min-h-[480px]">
            {/* Header of Simulated Document */}
            <div className="border-b-2 border-slate-800 pb-3 mb-4 flex justify-between items-start font-sans">
              <div>
                <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight">
                  {vendor.vendorName}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  Technical Specification Document • GeM Tender Submission Package
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400">DOC REF: {vendor.gemVendorId}</span>
                <p className="text-[10px] font-bold text-slate-700 font-sans">Page {currentPage}</p>
              </div>
            </div>

            {/* Document Body with Realistic OCR Highlighting */}
            <div className="space-y-4 font-sans text-xs">
              <div>
                <h5 className="font-bold text-slate-900 mb-1">
                  {check.section || 'Section 3.2: Technical Parameters & Environmental Envelope'}
                </h5>
                <p className="text-slate-600 leading-normal">
                  The manufacturing process complies with ISO 9001 and API standards. Materials for pressure containing components have been tested under rigorous laboratory quality assurance procedures.
                </p>
              </div>

              {/* Highlighted Bounding Box Area */}
              <div
                className={cn(
                  'p-4 rounded-xl border-2 transition-all my-4',
                  isNonCompliant
                    ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-200'
                    : 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200'
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono',
                      isNonCompliant ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                    )}
                  >
                    AI Optical OCR Extracted Snippet • Match Target
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Confidence: {check.confidence}%</span>
                </div>

                <div className="text-slate-900 font-mono text-xs font-semibold py-1">
                  {check.extractedSnippet}
                </div>

                {check.variance && (
                  <div className="mt-2 pt-2 border-t border-rose-200 flex items-center gap-2 text-rose-800 text-[11px] font-sans font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Specification Deviation: {check.variance}</span>
                  </div>
                )}
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1">Section 3.3: Material Testing & Certification</h5>
                <p className="text-slate-600 leading-normal">
                  Non-destructive examination (NDE) and hydrostatic shell test procedures are performed in accordance with ASME B16.34 and API Spec 6D. Hydrostatic shell test pressure is certified at 1.5 times maximum design pressure for 30 minutes.
                </p>
              </div>

              <div className="pt-8 text-center text-slate-400 font-mono text-[10px] border-t border-slate-100">
                — End of Page {currentPage} Excerpt —
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: AI Compliance Result & Human-in-the-Loop Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            {/* Clause Top Summary */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Requirement Verification
                </span>
                <h4 className="text-base font-bold text-slate-900">{check.clauseId}</h4>
              </div>
              <StatusBadge status={check.status} size="lg" />
            </div>

            {/* Comparison Variance Matrix */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <div className="text-xs">
                <span className="text-slate-500 font-semibold block mb-0.5">Tender Mandatory Requirement:</span>
                <p className="font-bold text-slate-900">{check.tenderRequirement}</p>
                <p className="text-[10px] text-blue-700 font-mono mt-0.5">{check.tenderSnippet}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 font-semibold block mb-0.5">Vendor Submitted Response:</span>
                <p className={cn('font-bold', isNonCompliant ? 'text-rose-700' : 'text-emerald-800')}>
                  {check.vendorResponse}
                </p>
              </div>

              {check.variance && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Calculated Variance:</span>
                  <span className="font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    {check.variance}
                  </span>
                </div>
              )}
            </div>

            {/* AI Explanation Observation */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-blue-950">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <span>Explainable AI Observation</span>
              </div>
              <p className="text-blue-900 leading-relaxed">{check.aiObservation}</p>

              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-blue-800 font-medium">
                <span>AI Confidence: {check.confidence}%</span>
                <span>Source: {check.evidenceDocument} (p.{check.pageNumber})</span>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
              <strong className="block font-bold mb-0.5">System Recommendation:</strong>
              {check.aiRecommendation}
            </div>

            {/* Human Override Active Details */}
            {check.humanOverride && (
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>Officer Decision Recorded:</span>
                  <span className="font-mono text-[10px]">{check.humanOverride.timestamp}</span>
                </div>
                <p className="font-semibold text-purple-900">
                  {check.humanOverride.officer} — Action: {check.humanOverride.action}
                </p>
                <p className="text-purple-800">
                  <strong>Rationale:</strong> "{check.humanOverride.rationale}"
                </p>
                {check.humanOverride.comment && (
                  <p className="text-purple-700">
                    <strong>Comment:</strong> "{check.humanOverride.comment}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Area / Override Form */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            {isSuccessFeedback ? (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                Decision saved & recorded in immutable audit trail.
              </div>
            ) : !overrideMode ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setOverrideAction('Approved');
                    setOverrideRationale('AI observation verified and approved as compliant by technical officer.');
                    setOverrideMode(true);
                  }}
                  className="btn-primary flex-1 text-xs py-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept AI Finding</span>
                </button>

                <button
                  onClick={() => {
                    setOverrideAction('Overridden');
                    setOverrideRationale('');
                    setOverrideMode(true);
                  }}
                  className="btn-secondary text-xs py-2"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-700" />
                  <span>Override</span>
                </button>

                <button
                  onClick={() => {
                    setOverrideAction('Clarification Requested');
                    setOverrideRationale('Dispatched formal clarification request to bidder through GeM query portal.');
                    setOverrideMode(true);
                  }}
                  className="btn-secondary text-xs py-2 text-amber-800 hover:bg-amber-50"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>Request Clarification</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Record Human-in-the-Loop Review</span>
                  <button
                    onClick={() => setOverrideMode(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Select Action:</label>
                  <select
                    value={overrideAction}
                    onChange={e => setOverrideAction(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                  >
                    <option value="Approved">Approve as Compliant</option>
                    <option value="Overridden">Override AI Decision</option>
                    <option value="Rejected">Reject / Disqualify Clause</option>
                    <option value="Clarification Requested">Request Bidder Clarification (GeM GTC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Mandatory Technical Rationale:
                  </label>
                  <textarea
                    rows={2}
                    value={overrideRationale}
                    onChange={e => setOverrideRationale(e.target.value)}
                    placeholder="Enter explicit justification for the evaluation record..."
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setOverrideMode(false)}
                    className="btn-secondary text-xs py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDecision}
                    className="btn-primary text-xs py-1.5"
                  >
                    Save Decision to Audit Trail
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
