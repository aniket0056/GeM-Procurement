import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileUp,
  UploadCloud,
  FileText,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { BID_ANALYSIS_STEPS } from '../services/aiService';
import { LoadingPipeline } from '../components/common/LoadingPipeline';

export const BidUpload: React.FC = () => {
  const navigate = useNavigate();
  const { selectedTender, currentVendors, setSelectedVendorId, addAuditLogEntry } = useProcurement();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBidders, setSelectedBidders] = useState<string[]>([
    'Alpha Engineering Pvt Ltd',
    'Bharat Industrial Systems',
    'PetroTech Solutions',
    'National Pipeline Equipment Ltd',
    'Vertex Engineering India Pvt Ltd',
  ]);

  const documentTypes = [
    'Vendor Technical Bid (Datasheets / BOM)',
    'Financial BOQ & Price Schedule',
    'ISO 9001 / ISO 14001 Certificates',
    'Company Registration (MCA / CIN)',
    'GST Registration Certificate',
    'PAN Card Copy',
    'Past Performance & Client Credentials',
    'CA Audited Turnover with UDIN',
    'OEM Authorization Form (MAF)',
    'Make in India Local Content Class-I Cert',
    'EMD Bank Guarantee Proof',
  ];

  const handleStartBatchVerification = () => {
    setIsProcessing(true);
    addAuditLogEntry(
      'Batch AI Verification Triggered',
      'Compliance Check',
      `Officer initiated 9-stage compliance analysis across 5 vendor bid packages for ${selectedTender.gemBidNumber}.`
    );
  };

  const handleComplete = () => {
    setIsProcessing(false);
    if (currentVendors.length > 0) {
      setSelectedVendorId(currentVendors[0].id);
    }
    navigate('/verification');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {selectedTender.gemBidNumber}
            </span>
            <span className="text-xs text-slate-500 font-medium">{selectedTender.department}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Vendor Bid Submission Ingestion & Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-document package ingestion with automated classification and cross-verification
          </p>
        </div>

        <button
          onClick={handleStartBatchVerification}
          disabled={isProcessing}
          className="btn-primary text-xs py-2.5 px-4 bg-blue-900 hover:bg-blue-950 shadow-md shadow-blue-950/20 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run 9-Stage AI Verification</span>
        </button>
      </div>

      {/* If processing, show animated pipeline */}
      {isProcessing ? (
        <div className="py-6">
          <LoadingPipeline
            steps={BID_ANALYSIS_STEPS}
            onComplete={handleComplete}
            title="AI Multi-Vendor Compliance & Risk Pipeline"
            subtitle="Executing 9-stage optical verification, clause comparison, turnover validation & explainability synthesis"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Drag & Drop Ingestion Zone */}
          <div className="lg:col-span-2 space-y-6">
            {/* Multi-Document Upload Zone */}
            <div className="enterprise-card p-6 bg-white space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Batch Bid Ingestion Dropzone (PDF, DOCX, XLSX, PNG, JPG)
              </h3>

              <div className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-8 bg-blue-50/20 hover:bg-blue-50/50 transition-colors text-center cursor-pointer flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mb-3">
                  <UploadCloud className="w-8 h-8 opacity-80" />
                </div>
                <p className="text-sm font-bold text-slate-900">
                  Drag and drop multiple vendor zip packages or individual documents
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  Autonomous document classifier automatically sorts technical bids, financial schedules, CA turnover sheets, and certificates.
                </p>
              </div>

              {/* Supported Document Types Grid */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Recognized Procurement Document Schemas (11 Standard Types):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {documentTypes.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="text-[11px] truncate">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Uploaded Vendors List */}
          <div className="space-y-4">
            <div className="enterprise-card p-5 bg-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-900" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Queued Bidder Submissions ({selectedBidders.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  All Ready
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedBidders.map((vendor, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{vendor}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Package: 4 files attached</p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartBatchVerification}
                className="w-full btn-primary text-xs py-2.5 justify-center shadow-md"
              >
                <span>Launch Autonomous Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
