import React from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { VendorComparisonTable } from '../components/vendors/VendorComparisonTable';
import { VendorRadarCompare } from '../components/vendors/VendorRadarCompare';

export const VendorComparison: React.FC = () => {
  const { selectedTender, currentVendors, setSelectedVendorId } = useProcurement();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {selectedTender.gemBidNumber}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{selectedTender.department}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Vendor Bid Comparative Intelligence Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side compliance scoring, technical parameter benchmarking & pricing distribution across competing bidders
          </p>
        </div>
      </div>

      {/* Benchmark Chart */}
      <VendorRadarCompare vendors={currentVendors} />

      {/* Comparison Table */}
      <VendorComparisonTable
        tender={selectedTender}
        vendors={currentVendors}
        onSelectVendor={setSelectedVendorId}
      />
    </div>
  );
};
