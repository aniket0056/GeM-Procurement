import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  CheckSquare,
  FileDown,
  Eye,
  ArrowUpDown,
  Search,
  Building,
  Filter,
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';
import { StatusBadge } from '../common/StatusBadge';
import { ExportService } from '../../services/exportService';

export const RecentProcurementsTable: React.FC = () => {
  const { tenders, setSelectedTenderId } = useProcurement();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filtered = tenders.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gemBidNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || t.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleVerify = (tenderId: string) => {
    setSelectedTenderId(tenderId);
    navigate('/verification');
  };

  const handleView = (tenderId: string) => {
    setSelectedTenderId(tenderId);
    navigate('/procurements');
  };

  const handleDownload = (tenderId: string) => {
    const tender = tenders.find(t => t.id === tenderId);
    if (tender) {
      ExportService.exportVendorComparisonToCSV(tender, []);
    }
  };

  return (
    <div className="enterprise-card overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200/80 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active GeM Procurements</h3>
            <p className="text-xs text-slate-500">Live tender monitoring, compliance status and verification queues</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title / BID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 w-48 text-slate-800"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
          >
            <option value="All">All PSUs</option>
            <option value="ONGC">ONGC</option>
            <option value="GAIL">GAIL</option>
            <option value="IOCL">IOCL</option>
            <option value="BPCL">BPCL</option>
            <option value="HPCL">HPCL</option>
            <option value="OIL">OIL</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Evaluation">Evaluation</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Flagged">Flagged</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>

      {/* Table Component */}
      <div className="overflow-x-auto">
        <table className="interactive-table">
          <thead>
            <tr>
              <th>Tender ID</th>
              <th>Tender Title</th>
              <th>Department</th>
              <th className="text-center">Total Bids</th>
              <th className="text-center">Verified</th>
              <th className="text-center">Compliance</th>
              <th>Deadline</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-slate-400 text-xs">
                  No procurement records matching selected filters.
                </td>
              </tr>
            ) : (
              filtered.map(t => (
                <tr key={t.id} className="group">
                  <td className="font-mono font-bold text-xs text-blue-900 whitespace-nowrap">
                    {t.gemBidNumber}
                  </td>
                  <td className="max-w-xs">
                    <div className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-900 transition-colors">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{t.category}</div>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 font-bold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Building className="w-3 h-3 text-blue-800" />
                      {t.department}
                    </span>
                  </td>
                  <td className="text-center font-mono font-semibold text-slate-700">{t.totalBids}</td>
                  <td className="text-center font-mono font-semibold text-blue-700">{t.verifiedBids}</td>
                  <td className="text-center">
                    <div className="inline-flex items-center gap-1 font-bold text-xs">
                      <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            t.averageCompliance >= 90
                              ? 'bg-emerald-500'
                              : t.averageCompliance >= 80
                              ? 'bg-blue-600'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${t.averageCompliance}%` }}
                        />
                      </div>
                      <span
                        className={
                          t.averageCompliance >= 90
                            ? 'text-emerald-700'
                            : t.averageCompliance >= 80
                            ? 'text-blue-700'
                            : 'text-rose-700'
                        }
                      >
                        {t.averageCompliance}%
                      </span>
                    </div>
                  </td>
                  <td className="text-xs text-slate-500 whitespace-nowrap">{t.submissionDeadline}</td>
                  <td>
                    <StatusBadge status={t.status} size="sm" />
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleView(t.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                        title="View Tender Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleVerify(t.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold shadow-xs transition-all"
                        title="Run AI Verification"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Verify</span>
                      </button>
                      <button
                        onClick={() => handleDownload(t.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="Download Evaluation Report"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
