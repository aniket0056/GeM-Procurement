import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { ComplianceCheck, VendorBid } from '../types';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ComplianceMatrixTable } from '../components/compliance/ComplianceMatrixTable';
import { SplitScreenViewer } from '../components/compliance/SplitScreenViewer';
import { Modal } from '../components/common/Modal';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { cn } from '../utils';

export const BidVerification: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedTender,
    currentVendors,
    selectedVendor,
    setSelectedVendorId,
    updateComplianceCheckOverride,
    currentUser,
  } = useProcurement();

  const [activeCheckForSplit, setActiveCheckForSplit] = useState<ComplianceCheck | null>(null);
  const [overrideModalCheck, setOverrideModalCheck] = useState<ComplianceCheck | null>(null);
  const [overrideAction, setOverrideAction] = useState<'Approved' | 'Rejected' | 'Overridden' | 'Clarification Requested'>('Approved');
  const [overrideRationale, setOverrideRationale] = useState<string>('');
  const [overrideComment, setOverrideComment] = useState<string>('');

  const checks = selectedVendor.complianceChecks || [];

  const handleOpenOverride = (check: ComplianceCheck) => {
    setOverrideModalCheck(check);
    setOverrideAction('Approved');
    setOverrideRationale('Technical parameter variance reviewed and approved by evaluating officer.');
    setOverrideComment('');
  };

  const handleSaveOverrideModal = () => {
    if (!overrideModalCheck) return;
    if (!overrideRationale.trim()) {
      alert('Mandatory evaluation rationale required.');
      return;
    }
    updateComplianceCheckOverride(
      selectedVendor.id,
      overrideModalCheck.id,
      overrideAction,
      overrideRationale,
      overrideComment
    );
    setOverrideModalCheck(null);
  };

  return (
    <div className="space-y-6">
      {/* Vendor Selector Pill Bar */}
      <div className="enterprise-card p-3.5 bg-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-900" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Select Active Bidder:
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {currentVendors.map((v: VendorBid) => (
            <button
              key={v.id}
              onClick={() => setSelectedVendorId(v.id)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2',
                selectedVendor.id === v.id
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              )}
            >
              <span>{v.vendorName}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold',
                  selectedVendor.id === v.id ? 'bg-blue-800 text-blue-100' : 'bg-white text-slate-700'
                )}
              >
                {v.overallComplianceScore}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Bid Compliance Results Header */}
      <div className="enterprise-card p-6 bg-white border border-slate-200 shadow-enterprise">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Vendor Details */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                {selectedTender.gemBidNumber}
              </span>
              <StatusBadge status={selectedVendor.status} size="md" />
              <span className="text-xs text-slate-400 font-mono">
                Submitted {selectedVendor.bidSubmissionDate}
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {selectedVendor.vendorName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <span>
                GeM Vendor ID: <strong className="text-slate-800 font-mono">{selectedVendor.gemVendorId}</strong>
              </span>
              <span>•</span>
              <span>
                GSTIN: <strong className="text-slate-800 font-mono">{selectedVendor.gstin}</strong>
              </span>
              <span>•</span>
              <span>
                CIN: <strong className="text-slate-800 font-mono">{selectedVendor.cinNumber}</strong>
              </span>
            </div>

            {/* AI Summary Recommendation */}
            <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2 text-xs text-blue-950">
              <Sparkles className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-blue-900">AI Evaluation Recommendation:</strong>{' '}
                {selectedVendor.aiRecommendation}
              </p>
            </div>
          </div>

          {/* Overall Compliance Radial Gauge */}
          <div className="flex items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex-shrink-0">
            <ScoreGauge
              score={selectedVendor.overallComplianceScore}
              size={130}
              strokeWidth={10}
              label="Compliance"
              sublabel="Overall Score"
            />

            {/* Pillar Breakdown Bars */}
            <div className="space-y-2 w-48 text-xs font-medium">
              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Eligibility</span>
                  <strong className="font-mono">{selectedVendor.eligibilityComplianceScore}%</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${selectedVendor.eligibilityComplianceScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Technical</span>
                  <strong className="font-mono">{selectedVendor.technicalComplianceScore}%</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-700 h-full rounded-full"
                    style={{ width: `${selectedVendor.technicalComplianceScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Documents</span>
                  <strong className="font-mono">{selectedVendor.documentComplianceScore}%</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${selectedVendor.documentComplianceScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Financial</span>
                  <strong className="font-mono">{selectedVendor.financialComplianceScore}%</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${selectedVendor.financialComplianceScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Certificates</span>
                  <strong className="font-mono">{selectedVendor.certificationComplianceScore}%</strong>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{ width: `${selectedVendor.certificationComplianceScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split-Screen Modal / Drawer View if Active */}
      {activeCheckForSplit && (
        <div className="my-6">
          <SplitScreenViewer
            check={activeCheckForSplit}
            vendor={selectedVendor}
            onClose={() => setActiveCheckForSplit(null)}
          />
        </div>
      )}

      {/* Main Clause-by-Clause Compliance Matrix Table */}
      <ComplianceMatrixTable
        vendor={selectedVendor}
        checks={checks}
        onOpenSplitViewer={check => setActiveCheckForSplit(check)}
        onOpenOverride={check => handleOpenOverride(check)}
      />

      {/* Human Review / Override Dialog Modal */}
      {overrideModalCheck && (
        <Modal
          isOpen={true}
          onClose={() => setOverrideModalCheck(null)}
          title={`Human-in-the-Loop Override: Clause ${overrideModalCheck.clauseId}`}
          subtitle={`Tender Requirement: "${overrideModalCheck.tenderRequirement}"`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-slate-500 font-semibold block">Vendor Response Found:</span>
              <p className="font-bold text-slate-900">{overrideModalCheck.vendorResponse}</p>
              {overrideModalCheck.variance && (
                <p className="text-rose-700 font-mono font-bold">
                  Calculated Variance: {overrideModalCheck.variance}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select Evaluator Action
              </label>
              <select
                value={overrideAction}
                onChange={e => setOverrideAction(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-medium text-slate-900 bg-white"
              >
                <option value="Approved">Approve as Compliant (Accept Deviation)</option>
                <option value="Overridden">Override AI Finding (Discretionary Clearance)</option>
                <option value="Rejected">Reject / Disqualify Bidder for Non-Compliance</option>
                <option value="Clarification Requested">Issue 48-Hr Clarification Query via GeM</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mandatory Technical Rationale (Recorded in Audit Ledger)
              </label>
              <textarea
                rows={3}
                required
                value={overrideRationale}
                onChange={e => setOverrideRationale(e.target.value)}
                placeholder="Enter justification explaining why this finding is accepted or overridden..."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Optional Committee Comment
              </label>
              <input
                type="text"
                value={overrideComment}
                onChange={e => setOverrideComment(e.target.value)}
                placeholder="Internal committee notes..."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-900 text-[11px] font-mono">
              Signing Officer: <strong>{currentUser.name}</strong> ({currentUser.role})
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOverrideModalCheck(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOverrideModal}
                className="btn-primary text-xs"
              >
                Save Decision & Update Audit Trail
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Statutory Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
