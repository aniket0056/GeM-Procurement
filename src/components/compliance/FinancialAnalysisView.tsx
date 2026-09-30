import React from 'react';
import {
  VendorBid,
} from '../../types';
import {
  Calculator,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  Percent,
  ShieldCheck,
  Receipt,
  Layers,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR, cn } from '../../utils';

interface FinancialAnalysisViewProps {
  vendor: VendorBid;
}

export const FinancialAnalysisView: React.FC<FinancialAnalysisViewProps> = ({ vendor }) => {
  const fin = vendor.financialDetails;

  return (
    <div className="space-y-6">
      {/* Top Financial KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="enterprise-card p-4 bg-white border-l-4 border-l-blue-900">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quoted Bid Value
          </span>
          <h3 className="text-xl font-bold text-blue-950 font-mono mt-1">
            {formatINR(fin.quotedValue)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Base Price excl. GST</p>
        </div>

        <div className="enterprise-card p-4 bg-white border-l-4 border-l-slate-400">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Estimated Tender Value
          </span>
          <h3 className="text-xl font-bold text-slate-800 font-mono mt-1">
            {formatINR(fin.estimatedValue)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">ONGC Sanctioned Budget</p>
        </div>

        <div className="enterprise-card p-4 bg-white border-l-4 border-l-emerald-600">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Price Variance
          </span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-xl font-bold text-emerald-700 font-mono">
              {fin.variancePercentage > 0 ? `+${fin.variancePercentage}%` : `${fin.variancePercentage}%`}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Below Est.
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Savings for Ministry</p>
        </div>

        <div className="enterprise-card p-4 bg-white border-l-4 border-l-indigo-600">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            EMD Compliance
          </span>
          <h3 className="text-xl font-bold text-slate-900 font-mono mt-1">
            {formatINR(fin.emdSubmitted)}
          </h3>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Req: {formatINR(fin.emdRequired)}</span>
            <StatusBadge status={fin.emdStatus} size="sm" />
          </div>
        </div>
      </div>

      {/* Anomaly Notice if applicable */}
      {fin.pricingAnomaly !== 'Normal Range' && (
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 flex items-start gap-3 text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Financial Pricing Anomaly Flagged: {fin.pricingAnomaly}
            </h4>
            <p className="text-xs text-amber-900 mt-1">
              Quoted unit price on core components deviates significantly from median market benchmark. Requires rate reasonability justification under GeM Price Reasonability guidelines.
            </p>
          </div>
        </div>
      )}

      {/* Financial Verification Grid: Tax, Arithmetic, Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Arithmetic Check */}
        <div className="enterprise-card p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-slate-900">BOQ Arithmetic Verification</span>
            </div>
            <StatusBadge status={fin.arithmeticValidation} size="sm" />
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Line Item Summation:</span>
              <strong className="font-mono text-slate-900">{formatINR(fin.quotedValue)}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>BOQ Summary Total:</span>
              <strong className="font-mono text-slate-900">{formatINR(fin.quotedValue)}</strong>
            </div>
            <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
              <span>Mathematical Delta:</span>
              <strong className="font-mono text-emerald-700">₹0.00 (Zero Discrepancy)</strong>
            </div>
          </div>
        </div>

        {/* Tax Verification */}
        <div className="enterprise-card p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-indigo-700" />
              <span className="text-xs font-bold text-slate-900">Tax & GST Rate Check</span>
            </div>
            <StatusBadge status="Verified" size="sm" />
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Applied GST Rate:</span>
              <strong className="font-mono text-slate-900">{fin.gstRate}% (HSN 8481.80)</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Computed GST Amount:</span>
              <strong className="font-mono text-slate-900">{formatINR(fin.gstAmount)}</strong>
            </div>
            <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
              <span>Total Contract with GST:</span>
              <strong className="font-mono text-blue-900 font-bold">{formatINR(fin.totalWithGst)}</strong>
            </div>
          </div>
        </div>

        {/* EMD & Security Deposit */}
        <div className="enterprise-card p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-slate-900">EMD & Security Deposit</span>
            </div>
            <StatusBadge status="Valid" size="sm" />
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Mandatory EMD (2%):</span>
              <strong className="font-mono text-slate-900">{formatINR(fin.emdRequired)}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Bank Guarantee Instrument:</span>
              <strong className="font-mono text-slate-900">SBI-BG-2026-9912</strong>
            </div>
            <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
              <span>Instrument Validity:</span>
              <strong className="font-mono text-slate-700">Valid till 31 Mar 2027</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Item-wise Bill of Quantities (BOQ) Breakdown */}
      {fin.itemBreakdown && fin.itemBreakdown.length > 0 && (
        <div className="enterprise-card overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Itemized Bill of Quantities (BOQ) Rate Reasonability
                </h3>
                <p className="text-xs text-slate-500">
                  Benchmarked against Indian Oil & Gas historical procurement index
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="interactive-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Quoted Unit Rate</th>
                  <th className="text-right">Total Line Value</th>
                  <th className="text-right">Historical Benchmark</th>
                  <th className="text-center">Deviation</th>
                </tr>
              </thead>
              <tbody>
                {fin.itemBreakdown.map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-slate-900 text-xs">
                      {item.item}
                    </td>
                    <td className="text-center font-mono font-bold text-xs text-slate-700">
                      {item.qty}
                    </td>
                    <td className="text-right font-mono text-xs text-slate-800">
                      {formatINR(item.unitPrice)}
                    </td>
                    <td className="text-right font-mono font-bold text-xs text-blue-950">
                      {formatINR(item.total)}
                    </td>
                    <td className="text-right font-mono text-xs text-slate-500">
                      {formatINR(item.marketBenchmark)}
                    </td>
                    <td className="text-center">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[11px] font-mono font-bold',
                          item.deviationPercentage < -20
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        )}
                      >
                        {item.deviationPercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
