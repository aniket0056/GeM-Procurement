import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  Layers,
  Award,
  DollarSign,
  FileSpreadsheet,
  Users,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { ComplianceCheck, VendorBid } from '../types';
import { ComplianceMatrixTable } from '../components/compliance/ComplianceMatrixTable';
import { SplitScreenViewer } from '../components/compliance/SplitScreenViewer';
import { CrossDocValidatorView } from '../components/compliance/CrossDocValidatorView';
import { CertificateTrackerView } from '../components/compliance/CertificateTrackerView';
import { FinancialAnalysisView } from '../components/compliance/FinancialAnalysisView';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { cn } from '../utils';

export const ComplianceAnalysis: React.FC = () => {
  const {
    selectedTender,
    currentVendors,
    selectedVendor,
    setSelectedVendorId,
    updateComplianceCheckOverride,
    currentUser,
  } = useProcurement();

  const [activeTab, setActiveTab] = useState<'matrix' | 'crossdoc' | 'certs' | 'financial'>('matrix');
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
      {/* Top Vendor Selector Header */}
      <div className="enterprise-card p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {selectedTender.gemBidNumber}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{selectedTender.department}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Comprehensive Bid Compliance & Statutory Verification
          </h1>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {currentVendors.map((v: VendorBid) => (
            <button
              key={v.id}
              onClick={() => setSelectedVendorId(v.id)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2',
                selectedVendor.id === v.id
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              )}
            >
              <span>{v.vendorName}</span>
              <span className="font-mono text-[10px] font-bold">({v.overallComplianceScore}%)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('matrix')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap',
            activeTab === 'matrix'
              ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Clause Compliance Matrix ({checks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('crossdoc')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap',
            activeTab === 'crossdoc'
              ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>Cross-Document Entity Validation ({selectedVendor.crossDocumentValidations?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('certs')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap',
            activeTab === 'certs'
              ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <Award className="w-4 h-4" />
          <span>Statutory Certificates ({selectedVendor.certificates?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('financial')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap',
            activeTab === 'financial'
              ? 'border-blue-900 text-blue-900 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <DollarSign className="w-4 h-4" />
          <span>Financial Bid Analysis</span>
        </button>
      </div>

      {/* Split-Screen Viewer if a clause was triggered */}
      {activeCheckForSplit && (
        <div className="my-4">
          <SplitScreenViewer
            check={activeCheckForSplit}
            vendor={selectedVendor}
            onClose={() => setActiveCheckForSplit(null)}
          />
        </div>
      )}

      {/* Tab 1: Clause Matrix */}
      {activeTab === 'matrix' && (
        <ComplianceMatrixTable
          vendor={selectedVendor}
          checks={checks}
          onOpenSplitViewer={check => setActiveCheckForSplit(check)}
          onOpenOverride={check => handleOpenOverride(check)}
        />
      )}

      {/* Tab 2: Cross-Document Validation */}
      {activeTab === 'crossdoc' && (
        <CrossDocValidatorView vendor={selectedVendor} />
      )}

      {/* Tab 3: Certificate Verification */}
      {activeTab === 'certs' && (
        <CertificateTrackerView vendor={selectedVendor} />
      )}

      {/* Tab 4: Financial Verification */}
      {activeTab === 'financial' && (
        <FinancialAnalysisView vendor={selectedVendor} />
      )}

      {/* Override Modal */}
      {overrideModalCheck && (
        <Modal
          isOpen={true}
          onClose={() => setOverrideModalCheck(null)}
          title={`Human Review & Override: Clause ${overrideModalCheck.clauseId}`}
          subtitle={`Requirement: "${overrideModalCheck.tenderRequirement}"`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block">Vendor Response:</span>
              <p className="font-bold text-slate-900">{overrideModalCheck.vendorResponse}</p>
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
                <option value="Approved">Approve as Compliant</option>
                <option value="Overridden">Override AI Decision</option>
                <option value="Rejected">Reject Clause</option>
                <option value="Clarification Requested">Request Clarification</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mandatory Technical Rationale
              </label>
              <textarea
                rows={3}
                required
                value={overrideRationale}
                onChange={e => setOverrideRationale(e.target.value)}
                placeholder="Enter justification for the audit trail..."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900"
              />
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
