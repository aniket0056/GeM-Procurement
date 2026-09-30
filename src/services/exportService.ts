import { Tender, VendorBid, ComplianceCheck, AuditLog } from '../types';
import { formatINR } from '../utils';

export class ExportService {
  /**
   * Export Compliance Matrix to CSV
   */
  static exportComplianceMatrixToCSV(vendor: VendorBid, checks: ComplianceCheck[]): void {
    const headers = [
      'Clause ID',
      'Category',
      'Tender Requirement',
      'Vendor Response',
      'Evidence Document',
      'Page',
      'AI Status',
      'Confidence (%)',
      'Risk Level',
      'Reviewer Status',
      'Variance',
      'AI Observation',
    ];

    const rows = checks.map(c => [
      `"${c.clauseId}"`,
      `"${c.category}"`,
      `"${c.tenderRequirement.replace(/"/g, '""')}"`,
      `"${c.vendorResponse.replace(/"/g, '""')}"`,
      `"${c.evidenceDocument}"`,
      `"${c.pageNumber}"`,
      `"${c.status}"`,
      `"${c.confidence}"`,
      `"${c.risk}"`,
      `"${c.reviewerStatus}"`,
      `"${c.variance || 'None'}"`,
      `"${c.aiObservation.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Compliance_Matrix_${vendor.vendorName.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export Vendor Comparison Matrix to CSV
   */
  static exportVendorComparisonToCSV(tender: Tender, vendors: VendorBid[]): void {
    const headers = [
      'Vendor Name',
      'GeM Vendor ID',
      'Overall Compliance (%)',
      'Technical Score (%)',
      'Document Score (%)',
      'Financial Score (%)',
      'Eligibility Score (%)',
      'Risk Level',
      'Missing Documents',
      'Deviations',
      'Quoted Price (INR)',
      'Status',
    ];

    const rows = vendors.map(v => [
      `"${v.vendorName}"`,
      `"${v.gemVendorId}"`,
      `"${v.overallComplianceScore}"`,
      `"${v.technicalComplianceScore}"`,
      `"${v.documentComplianceScore}"`,
      `"${v.financialComplianceScore}"`,
      `"${v.eligibilityComplianceScore}"`,
      `"${v.riskLevel}"`,
      `"${v.missingDocumentsCount}"`,
      `"${v.deviationsCount}"`,
      `"${v.financialDetails.quotedValue}"`,
      `"${v.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vendor_Comparison_${tender.gemBidNumber.replace(/\//g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export Audit Logs to CSV
   */
  static exportAuditLogsToCSV(logs: AuditLog[]): void {
    const headers = ['Timestamp', 'Officer / Actor', 'Action', 'Category', 'Details', 'IP Address', 'Session ID', 'Integrity Hash'];
    const rows = logs.map(l => [
      `"${l.timeFormatted}"`,
      `"${l.officer}"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
      `"${l.session}"`,
      `"${l.hash}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GeM_Compliance_Audit_Log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Print Report trigger
   */
  static triggerPrint(): void {
    window.print();
  }
}
