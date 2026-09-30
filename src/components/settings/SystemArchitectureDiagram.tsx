import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileUp,
  Scan,
  Sparkles,
  ListChecks,
  Users,
  Cpu,
  Layers,
  ShieldAlert,
  Bot,
  UserCheck,
  FileCheck,
  ArrowDown,
  CheckCircle2,
  Server,
  Database,
  Code,
} from 'lucide-react';
import { cn } from '../../utils';

export const SystemArchitectureDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const pipelineNodes = [
    {
      id: 1,
      title: 'GeM Procurement RFP Ingestion',
      subtitle: 'Tender RFP Ingestion Layer',
      icon: FileSpreadsheet,
      color: 'bg-blue-900 text-white',
      border: 'border-blue-700',
      description: 'Ingests PDF/DOCX/XLSX procurement specification documents and calculates initial SHA-256 checksums.',
      tech: 'Multer, Stream Parser, S3/GCS Object Store',
    },
    {
      id: 2,
      title: 'High-Resolution OCR & Layout Parser',
      subtitle: 'Multi-Modal Tokenizer',
      icon: Scan,
      color: 'bg-indigo-900 text-white',
      border: 'border-indigo-700',
      description: 'Executes document optical character recognition preserving tables, headers, font weights, and hierarchical sections.',
      tech: 'Tesseract OCR / LayoutLMv3 Engine',
    },
    {
      id: 3,
      title: 'AI Tender Requirement Extractor',
      subtitle: 'Clause Categorization Engine',
      icon: ListChecks,
      color: 'bg-blue-800 text-white',
      border: 'border-blue-600',
      description: 'Extracts and indexes eligibility, technical tolerances (bar, °C), turnover thresholds, EMD rates, and warranty requirements.',
      tech: 'Fine-tuned LLM Clause Parser & Heuristics',
    },
    {
      id: 4,
      title: 'Vendor Bid Package Ingestion',
      subtitle: 'Multi-Bid Document Pipeline',
      icon: Users,
      color: 'bg-slate-800 text-white',
      border: 'border-slate-600',
      description: 'Batch ingests multi-vendor submissions (Technical Datasheets, CA Statements, ISO/API Certificates, BOQs).',
      tech: 'Multi-threaded Async Document Queue',
    },
    {
      id: 5,
      title: 'Rule-Based Compliance Engine',
      subtitle: 'Clause-by-Clause Validator',
      icon: Cpu,
      color: 'bg-blue-950 text-white',
      border: 'border-blue-800',
      description: 'Compares extracted vendor specifications against tender mandatory clauses, computing mathematical variances (e.g. -5 bar).',
      tech: 'Deterministic Rules & Semantic Matcher',
    },
    {
      id: 6,
      title: 'Cross-Document & Certificate Validator',
      subtitle: 'Entity & Statutory Check',
      icon: Layers,
      color: 'bg-purple-900 text-white',
      border: 'border-purple-700',
      description: 'Cross-validates legal names, GSTINs, turnover numbers between self-declarations and CA audited sheets; flags expired certificates.',
      tech: 'GSTN/MCA Verification & OCR Entity Linker',
    },
    {
      id: 7,
      title: 'Procurement Risk & Fraud Engine',
      subtitle: 'Anomaly & Collusion Detection',
      icon: ShieldAlert,
      color: 'bg-rose-900 text-white',
      border: 'border-rose-700',
      description: 'Computes weighted 0-100 risk scores, flagging severe price depressions (-32%), missing OEM authorizations, and credential discrepancies.',
      tech: 'Statistical Anomaly Detector & Weighted Scorer',
    },
    {
      id: 8,
      title: 'Explainable AI & Grounded Reasoning',
      subtitle: 'Citation & Narrative Generator',
      icon: Bot,
      color: 'bg-emerald-900 text-white',
      border: 'border-emerald-700',
      description: 'Synthesizes plain-English audit summaries with exact document page citations and suggested officer review actions.',
      tech: 'Grounding Verification & RAG Retrieval',
    },
    {
      id: 9,
      title: 'Human-in-the-Loop Evaluation',
      subtitle: 'Officer Review & Override',
      icon: UserCheck,
      color: 'bg-amber-900 text-white',
      border: 'border-amber-700',
      description: 'Provides procurement officers with split-screen side-by-side evidence inspection, override logging, and clarification dispatch.',
      tech: 'RBAC Authorization & Immutable Audit Trail',
    },
    {
      id: 10,
      title: 'Compliance Report & Audit Archive',
      subtitle: 'Committee Deliverables',
      icon: FileCheck,
      color: 'bg-slate-900 text-white',
      border: 'border-slate-700',
      description: 'Generates official PDF evaluation reports, CSV matrices, and cryptographically hashed audit ledgers for Tender Committees.',
      tech: 'PDF Engine, CSV Exporter, SHA-256 Ledger',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="enterprise-card p-5 bg-white border border-slate-200">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-900">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              System Architecture & AI Pipeline Data Flow
            </h3>
            <p className="text-xs text-slate-500">
              End-to-end data processing lifecycle from GeM document ingestion to human committee endorsement
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          The platform employs a modular hybrid architecture combining deterministic rule engines, layout-aware OCR parsers, semantic vector embeddings, and an explainable decision-support layer. Click any pipeline stage to inspect technical subsystem interfaces.
        </p>
      </div>

      {/* Interactive Pipeline Steps Flow */}
      <div className="space-y-3">
        {pipelineNodes.map((node, idx) => {
          const isSelected = selectedNode === node.id;
          return (
            <div key={node.id} className="flex flex-col items-center">
              <div
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                className={cn(
                  'w-full enterprise-card p-4 transition-all duration-200 cursor-pointer border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
                  isSelected
                    ? 'ring-2 ring-blue-600 shadow-enterprise bg-blue-50/40 border-blue-300'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs', node.color)}>
                    <node.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        STAGE {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                        {node.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{node.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs self-end sm:self-center">
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {node.tech}
                  </span>
                  <span className="text-blue-700 font-bold text-[11px]">
                    {isSelected ? 'Collapse' : 'Details →'}
                  </span>
                </div>
              </div>

              {/* Subsystem Details Drawer */}
              {isSelected && (
                <div className="w-[96%] -mt-1 p-4 bg-slate-900 text-white rounded-b-xl border-x border-b border-slate-800 text-xs space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-blue-300 font-bold">
                    <span>Subsystem Functional Specifications:</span>
                    <span className="font-mono text-[10px]">Module: {node.tech}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{node.description}</p>
                </div>
              )}

              {/* Down Arrow connector (except last item) */}
              {idx < pipelineNodes.length - 1 && (
                <div className="my-1.5 flex items-center justify-center">
                  <ArrowDown className="w-4 h-4 text-slate-400 opacity-70" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
