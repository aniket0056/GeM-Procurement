import React from 'react';
import {
  VendorBid,
  CertificateValidation,
} from '../../types';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building,
  FileCheck,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { cn } from '../../utils';

interface CertificateTrackerViewProps {
  vendor: VendorBid;
}

export const CertificateTrackerView: React.FC<CertificateTrackerViewProps> = ({ vendor }) => {
  const certificates = vendor.certificates || [];
  const expiredCerts = certificates.filter(c => c.status === 'Expired');

  return (
    <div className="space-y-4">
      {/* Expired Certificate Warning Alert Banner */}
      {expiredCerts.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 flex items-start gap-3 text-rose-950 shadow-sm animate-in fade-in">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-700 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Mandatory Certificate Expired Alert
            </h4>
            <div className="mt-1 space-y-1">
              {expiredCerts.map(c => (
                <p key={c.id} className="text-xs font-semibold text-rose-900">
                  • <strong>{c.name}</strong> (#{c.certificateNumber}) expired on{' '}
                  <span className="font-mono underline font-bold">{c.expiryDate}</span> before bid submission date.
                </p>
              ))}
            </div>
            <p className="text-[11px] text-rose-700 mt-2">
              Action Required: Issue standard 48-hour shortfall notice on GeM portal or proceed with rejection as per PQC Clause 4.4.2.
            </p>
          </div>
        </div>
      )}

      {/* Certificate Table Card */}
      <div className="enterprise-card overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Accreditation & Statutory Certificate Verification
              </h3>
              <p className="text-xs text-slate-500">
                Automated validation of ISO, API Monogram, GSTN, PAN, and OEM Authorizations
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
            {certificates.length} Certificates Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="interactive-table">
            <thead>
              <tr>
                <th>Certificate Type</th>
                <th>Certificate Number</th>
                <th>Issuing Authority</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Validation Status</th>
              </tr>
            </thead>
            <tbody>
              {certificates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    No certificate records attached in this bid package.
                  </td>
                </tr>
              ) : (
                certificates.map(cert => {
                  const isExpired = cert.status === 'Expired';
                  return (
                    <tr
                      key={cert.id}
                      className={cn('transition-colors', isExpired && 'bg-rose-50/20')}
                    >
                      <td className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-700 flex-shrink-0" />
                        <span>{cert.name}</span>
                      </td>

                      <td className="font-mono font-bold text-xs text-blue-900">
                        {cert.certificateNumber}
                      </td>

                      <td className="text-xs text-slate-700">
                        {cert.issuingAuthority}
                      </td>

                      <td className="text-xs font-mono text-slate-600">
                        {cert.issueDate}
                      </td>

                      <td className="text-xs font-mono">
                        <span className={cn('font-bold', isExpired ? 'text-rose-700 underline' : 'text-slate-700')}>
                          {cert.expiryDate}
                        </span>
                        {cert.daysToExpiry !== undefined && cert.daysToExpiry > 0 && (
                          <span className="block text-[10px] text-slate-400 font-sans">
                            ({cert.daysToExpiry} days remaining)
                          </span>
                        )}
                      </td>

                      <td>
                        <StatusBadge status={cert.status} size="sm" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
