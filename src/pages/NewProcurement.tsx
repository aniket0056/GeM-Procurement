import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building,
  Calendar,
  DollarSign,
  Layers,
  Check,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { Tender, TenderRequirement } from '../types';
import { AIComplianceService, TENDER_EXTRACTION_STEPS } from '../services/aiService';
import { LoadingPipeline } from '../components/common/LoadingPipeline';
import { TenderRequirementEditor } from '../components/procurement/TenderRequirementEditor';

export const NewProcurement: React.FC = () => {
  const navigate = useNavigate();
  const { addNewTender, updateRequirement, approveAllRequirements } = useProcurement();

  // Form States
  const [tenderTitle, setTenderTitle] = useState('Supply of High Pressure Emergency Shutdown Valves & Fire Protection Assemblies');
  const [gemBidNumber, setGemBidNumber] = useState(`GEM/2026/B/${Math.floor(4000000 + Math.random() * 900000)}`);
  const [department, setDepartment] = useState<'ONGC' | 'GAIL' | 'IOCL' | 'BPCL' | 'HPCL' | 'OIL' | 'EIL'>('ONGC');
  const [category, setCategory] = useState('Industrial Goods & Safety Equipment');
  const [estimatedValue, setEstimatedValue] = useState('65000000'); // ₹6.50 Cr
  const [submissionDeadline, setSubmissionDeadline] = useState('18 Nov 2026, 17:00 IST');
  const [evaluationType, setEvaluationType] = useState<'Technical' | 'Financial' | 'Technical + Financial'>('Technical + Financial');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('ONGC_Offshore_ESD_Valves_Tender_2026.pdf');

  // Step Management
  const [currentStep, setCurrentStep] = useState<'form' | 'processing' | 'requirements'>('form');
  const [createdTenderId, setCreatedTenderId] = useState<string>('');
  const [extractedReqs, setExtractedReqs] = useState<TenderRequirement[]>([]);

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('processing');
  };

  const handleProcessingComplete = () => {
    const valNum = parseFloat(estimatedValue) || 65000000;
    const newTender: Tender = {
      id: gemBidNumber,
      title: tenderTitle,
      gemBidNumber,
      department,
      ministry: 'Ministry of Petroleum & Natural Gas',
      category,
      estimatedValue: valNum,
      submissionDeadline,
      evaluationType,
      status: 'Evaluation',
      totalBids: 5,
      verifiedBids: 0,
      averageCompliance: 89,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: `Procurement for ${tenderTitle} under ${department} capital expenditure modernization program.`,
      documentName: fileName,
      documentSize: '12.4 MB (38 Pages)',
      extractedRequirementsCount: 8,
      mandatoryClausesCount: 8,
    };

    const reqs = AIComplianceService.extractSampleRequirements(gemBidNumber);
    addNewTender(newTender, reqs);
    setCreatedTenderId(gemBidNumber);
    setExtractedReqs(reqs);
    setCurrentStep('requirements');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Create Procurement Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest tender RFP specifications for autonomous OCR parsing and clause extraction
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${currentStep === 'form' ? 'bg-blue-900 text-white' : 'bg-emerald-600 text-white'}`}>
              1
            </span>
            <span className="text-slate-700 hidden sm:inline">Tender Details</span>
            <span className="text-slate-300">→</span>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${currentStep === 'processing' ? 'bg-blue-900 text-white' : currentStep === 'requirements' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              2
            </span>
            <span className="text-slate-700 hidden sm:inline">AI Extraction</span>
            <span className="text-slate-300">→</span>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${currentStep === 'requirements' ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-600'}`}>
              3
            </span>
            <span className="text-slate-700 hidden sm:inline">Approve Clauses</span>
          </div>
        </div>
      </div>

      {/* Step 1: Input Form */}
      {currentStep === 'form' && (
        <form onSubmit={handleStartAnalysis} className="space-y-6">
          <div className="enterprise-card p-6 bg-white space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Procurement Tender Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Tender Title</label>
                <input
                  type="text"
                  required
                  value={tenderTitle}
                  onChange={e => setTenderTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GeM Bid Number</label>
                <input
                  type="text"
                  required
                  value={gemBidNumber}
                  onChange={e => setGemBidNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department / Procuring PSU</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                >
                  <option value="ONGC">Oil and Natural Gas Corporation (ONGC)</option>
                  <option value="GAIL">GAIL (India) Limited</option>
                  <option value="IOCL">Indian Oil Corporation Limited (IOCL)</option>
                  <option value="BPCL">Bharat Petroleum Corporation Limited (BPCL)</option>
                  <option value="HPCL">Hindustan Petroleum Corporation Limited (HPCL)</option>
                  <option value="OIL">Oil India Limited (OIL)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Procurement Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Procurement Value (INR)</label>
                <input
                  type="number"
                  required
                  value={estimatedValue}
                  onChange={e => setEstimatedValue(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Submission Deadline</label>
                <input
                  type="text"
                  required
                  value={submissionDeadline}
                  onChange={e => setSubmissionDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Evaluation Type</label>
                <select
                  value={evaluationType}
                  onChange={e => setEvaluationType(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                >
                  <option value="Technical + Financial">Technical + Financial (Two-Packet System)</option>
                  <option value="Technical">Technical Evaluation Only</option>
                  <option value="Financial">Financial Evaluation Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div className="enterprise-card p-6 bg-white space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Upload Tender RFP Document (PDF / DOCX / XLSX)
            </h3>

            <div className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-8 bg-blue-50/30 hover:bg-blue-50/60 transition-colors text-center cursor-pointer flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mb-3">
                <UploadCloud className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                Drag and drop tender RFP document here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supported formats: PDF, DOCX, XLSX (Up to 100 MB per file)
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-blue-900 font-bold shadow-2xs">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Selected Sample: {fileName}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate('/procurements')}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary text-xs py-2.5 px-5 bg-blue-900 hover:bg-blue-950 shadow-md shadow-blue-950/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upload & Analyze Tender</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Step 2: Animated AI Extraction Pipeline */}
      {currentStep === 'processing' && (
        <div className="py-8">
          <LoadingPipeline
            steps={TENDER_EXTRACTION_STEPS}
            onComplete={handleProcessingComplete}
            title="AI Tender Requirement Extraction Engine"
            subtitle="Processing clauses, technical tolerances, EMD conditions, and legal mandates from uploaded RFP"
          />
        </div>
      )}

      {/* Step 3: Extracted Requirements Review & Approval */}
      {currentStep === 'requirements' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <TenderRequirementEditor
            tenderId={createdTenderId}
            requirements={extractedReqs}
            onUpdateRequirement={(reqId: string, updates: Partial<TenderRequirement>) => updateRequirement(createdTenderId, reqId, updates)}
            onApproveAll={() => approveAllRequirements(createdTenderId)}
          />

          <div className="enterprise-card p-4 bg-white flex items-center justify-between border-t border-slate-200">
            <p className="text-xs text-slate-600 font-medium">
              Extracted requirements ready for vendor bid ingestion & automated verification.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/upload')}
                className="btn-primary text-xs py-2 px-4 shadow-sm"
              >
                <span>Proceed to Vendor Bid Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
