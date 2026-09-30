import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Flag,
  Edit3,
  Search,
  Filter,
  CheckCheck,
  AlertTriangle,
  FileText,
  Plus,
} from 'lucide-react';
import { TenderRequirement, RequirementCategory } from '../../types';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { Modal } from '../common/Modal';
import { cn } from '../../utils';

interface TenderRequirementEditorProps {
  tenderId: string;
  requirements: TenderRequirement[];
  onUpdateRequirement: (reqId: string, updates: Partial<TenderRequirement>) => void;
  onApproveAll: () => void;
}

export const TenderRequirementEditor: React.FC<TenderRequirementEditorProps> = ({
  tenderId,
  requirements,
  onUpdateRequirement,
  onApproveAll,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingReq, setEditingReq] = useState<TenderRequirement | null>(null);
  const [editText, setEditText] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const categories: string[] = [
    'All',
    'Eligibility Criteria',
    'Technical Requirements',
    'Turnover Requirements',
    'EMD Requirements',
    'Required Documents',
    'Certifications',
    'Delivery Requirements',
    'Warranty Requirements',
  ];

  const filtered = requirements.filter(r => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.clauseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tenderReference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenEdit = (req: TenderRequirement) => {
    setEditingReq(req);
    setEditText(req.requirement);
    setEditNotes(req.notes || '');
  };

  const handleSaveEdit = () => {
    if (editingReq) {
      onUpdateRequirement(editingReq.id, {
        requirement: editText,
        notes: editNotes,
        status: 'Approved',
      });
      setEditingReq(null);
    }
  };

  const handleToggleFlag = (req: TenderRequirement) => {
    const newStatus = req.status === 'Flagged' ? 'Approved' : 'Flagged';
    onUpdateRequirement(req.id, { status: newStatus });
  };

  const approvedCount = requirements.filter(r => r.status === 'Approved').length;
  const flaggedCount = requirements.filter(r => r.status === 'Flagged').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Controls */}
      <div className="enterprise-card p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-800/80 border border-blue-600/50 text-blue-200 flex-shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Extracted Tender Requirements</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-mono">
                  {requirements.length} Clauses Extracted
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1 max-w-2xl">
                The AI Compliance Engine extracted and structured all mandatory clauses, thresholds, and PQC criteria from the uploaded tender specification. Review, edit, or approve clauses before vendor bid verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onApproveAll}
              className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg shadow-emerald-950/20 text-xs py-2.5 px-4 whitespace-nowrap"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Approve All Requirements ({requirements.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-4 pt-4 border-t border-blue-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-blue-300">Total Clauses:</span>{' '}
            <strong className="text-white font-mono">{requirements.length}</strong>
          </div>
          <div>
            <span className="text-blue-300">Approved by Officer:</span>{' '}
            <strong className="text-emerald-300 font-mono">{approvedCount}</strong>
          </div>
          <div>
            <span className="text-blue-300">Flagged for Review:</span>{' '}
            <strong className="text-amber-300 font-mono">{flaggedCount}</strong>
          </div>
          <div>
            <span className="text-blue-300">Avg OCR Confidence:</span>{' '}
            <strong className="text-white font-mono">97.4%</strong>
          </div>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0',
                selectedCategory === cat
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clauses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
          />
        </div>
      </div>

      {/* Extracted Requirement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(req => {
          const isFlagged = req.status === 'Flagged';
          const isApproved = req.status === 'Approved';

          return (
            <div
              key={req.id}
              className={cn(
                'enterprise-card p-5 flex flex-col justify-between transition-all duration-200 border',
                isFlagged ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 bg-white'
              )}
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                      {req.clauseCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{req.category}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                        req.type === 'Mandatory'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {req.type}
                    </span>
                    {isFlagged ? (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Flagged
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Approved
                      </span>
                    )}
                  </div>
                </div>

                {/* Requirement Body Text */}
                <p className="text-xs font-medium text-slate-800 mt-3 leading-relaxed">
                  "{req.requirement}"
                </p>

                {/* Threshold & Reference Meta */}
                <div className="mt-3 pt-3 border-t border-slate-100/80 space-y-1.5 text-[11px]">
                  {req.thresholdValue && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Standard / Threshold:</span>
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded">
                        {req.thresholdValue}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Tender Reference:</span>
                    <span className="font-medium text-blue-800 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {req.tenderReference}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">AI Confidence:</span>
                    <ConfidenceMeter confidence={req.confidence} size="sm" />
                  </div>
                </div>

                {req.notes && (
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                    <strong className="text-slate-800">Review Note:</strong> {req.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEdit(req)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-900 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFlag(req)}
                    className={cn(
                      'inline-flex items-center gap-1 text-xs font-semibold py-1 px-2.5 rounded-lg border transition-colors',
                      isFlagged
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-800 border-slate-200'
                    )}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {isFlagged ? 'Unflag' : 'Flag'}
                  </button>

                  <button
                    onClick={() => onUpdateRequirement(req.id, { status: 'Approved' })}
                    className={cn(
                      'inline-flex items-center gap-1 text-xs font-semibold py-1 px-2.5 rounded-lg border transition-colors',
                      isApproved
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-300'
                    )}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Requirement Modal */}
      {editingReq && (
        <Modal
          isOpen={true}
          onClose={() => setEditingReq(null)}
          title={`Edit Requirement: ${editingReq.clauseCode}`}
          subtitle={`Category: ${editingReq.category} | Reference: ${editingReq.tenderReference}`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tender Requirement Description
              </label>
              <textarea
                rows={4}
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Officer Notes / Clarifications
              </label>
              <input
                type="text"
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder="Add internal evaluation note..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingReq(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn-primary text-xs"
              >
                Save & Approve Requirement
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
