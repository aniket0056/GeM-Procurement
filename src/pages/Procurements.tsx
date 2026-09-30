import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  PlusCircle,
  Search,
  Filter,
  Building,
  CheckSquare,
  FileUp,
  ListChecks,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Tender } from '../types';
import { formatINR } from '../utils';

export const Procurements: React.FC = () => {
  const { tenders, setSelectedTenderId } = useProcurement();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredTenders = tenders.filter((t: Tender) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gemBidNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || t.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleSelectAndNavigate = (tenderId: string, path: string) => {
    setSelectedTenderId(tenderId);
    navigate(path);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Procurement Tender Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage active GeM procurement specifications, AI clause extraction profiles, and verification queues
          </p>
        </div>

        <button
          onClick={() => navigate('/new')}
          className="btn-primary text-xs py-2 px-4 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Procurement Verification</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="enterprise-card p-4 bg-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by tender title, GeM BID number, or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="All">All PSUs / Divisions</option>
            <option value="ONGC">ONGC</option>
            <option value="GAIL">GAIL</option>
            <option value="IOCL">IOCL</option>
            <option value="BPCL">BPCL</option>
            <option value="HPCL">HPCL</option>
            <option value="OIL">OIL</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Evaluation">Evaluation</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Flagged">Flagged</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>

      {/* Tenders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTenders.map((t: Tender) => (
          <div
            key={t.id}
            className="enterprise-card p-5 flex flex-col justify-between hover:border-blue-300 transition-all duration-200"
          >
            <div>
              {/* Card Top Row */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {t.gemBidNumber}
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">Created {t.createdDate}</p>
                </div>
                <StatusBadge status={t.status} size="sm" />
              </div>

              {/* Title & Category */}
              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </div>

              {/* Specs & Meta */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-700" />
                    Procuring Entity:
                  </span>
                  <strong className="text-slate-900">{t.department}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Sanctioned Budget:</span>
                  <strong className="font-mono font-bold text-slate-900">{formatINR(t.estimatedValue)}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Submission Deadline:</span>
                  <span className="font-mono text-[11px] text-slate-700">{t.submissionDeadline}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5 text-emerald-700" />
                    Extracted Clauses:
                  </span>
                  <span className="font-mono font-bold text-blue-900">
                    {t.extractedRequirementsCount} Clauses ({t.mandatoryClausesCount} Mandatory)
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Total Bid Submissions:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {t.totalBids} Bids ({t.verifiedBids} Verified)
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleSelectAndNavigate(t.id, '/verification')}
                className="btn-primary text-xs py-1.5 px-3 flex-1"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Verify Bids</span>
              </button>

              <button
                onClick={() => handleSelectAndNavigate(t.id, '/upload')}
                className="btn-secondary text-xs py-1.5 px-3"
                title="Upload Vendor Bid Packages"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
