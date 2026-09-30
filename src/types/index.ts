export type RoleType = 
  | 'Procurement Officer' 
  | 'Technical Evaluator' 
  | 'Financial Evaluator' 
  | 'Audit Officer' 
  | 'Administrator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  department: string;
  ministry: string;
  designation: string;
  badgeNumber: string;
  avatar?: string;
  lastLogin: string;
}

export type TenderStatus = 'Published' | 'Evaluation' | 'Reviewing' | 'Flagged' | 'Completed';
export type EvaluationType = 'Technical' | 'Financial' | 'Technical + Financial';

export interface Tender {
  id: string;
  title: string;
  gemBidNumber: string;
  department: 'ONGC' | 'GAIL' | 'IOCL' | 'BPCL' | 'HPCL' | 'OIL' | 'EIL';
  ministry: string;
  category: string;
  estimatedValue: number; // in INR
  submissionDeadline: string;
  evaluationType: EvaluationType;
  status: TenderStatus;
  totalBids: number;
  verifiedBids: number;
  averageCompliance: number;
  createdDate: string;
  description: string;
  documentName: string;
  documentSize: string;
  extractedRequirementsCount: number;
  mandatoryClausesCount: number;
}

export type RequirementCategory = 
  | 'Eligibility Criteria'
  | 'Technical Requirements'
  | 'Financial Requirements'
  | 'Required Documents'
  | 'Certifications'
  | 'Experience Requirements'
  | 'Turnover Requirements'
  | 'EMD Requirements'
  | 'Delivery Requirements'
  | 'Warranty Requirements';

export interface TenderRequirement {
  id: string;
  tenderId: string;
  category: RequirementCategory;
  requirement: string;
  type: 'Mandatory' | 'Preferred' | 'Discretionary';
  confidence: number; // 0 - 100
  tenderReference: string; // e.g., "Section 4.2, Page 18"
  status: 'Approved' | 'Flagged' | 'Pending Review';
  thresholdValue?: string;
  clauseCode: string;
  notes?: string;
}

export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Partially Compliant' | 'Missing' | 'Under Review';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ReviewerActionType = 'Approved' | 'Review Required' | 'Pending Review' | 'Overridden' | 'Clarification Requested';

export interface HumanOverride {
  officer: string;
  action: 'Approved' | 'Rejected' | 'Overridden' | 'Clarification Requested';
  timestamp: string;
  rationale: string;
  comment?: string;
}

export interface ComplianceCheck {
  id: string;
  vendorId: string;
  clauseId: string;
  category: RequirementCategory;
  tenderRequirement: string;
  vendorResponse: string;
  evidenceDocument: string;
  pageNumber: number;
  section: string;
  extractedSnippet: string;
  tenderSnippet: string;
  status: ComplianceStatus;
  confidence: number;
  risk: RiskLevel;
  reviewerStatus: ReviewerActionType;
  variance?: string;
  aiObservation: string;
  aiRecommendation: string;
  humanOverride?: HumanOverride;
}

export interface CrossDocValidation {
  id: string;
  parameter: string;
  doc1Name: string;
  doc1Value: string;
  doc2Name: string;
  doc2Value: string;
  status: 'Verified' | 'Minor Variation' | 'Mismatch';
  severity: 'Low' | 'Medium' | 'High';
  notes: string;
}

export interface CertificateValidation {
  id: string;
  name: string;
  certificateNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expired' | 'Expiring Soon' | 'Unverified';
  daysToExpiry?: number;
  fileName: string;
}

export interface FinancialItemBreakdown {
  item: string;
  qty: number;
  unitPrice: number;
  total: number;
  marketBenchmark: number;
  deviationPercentage: number;
}

export interface FinancialDetail {
  quotedValue: number;
  estimatedValue: number;
  variancePercentage: number;
  gstRate: number;
  gstAmount: number;
  totalWithGst: number;
  emdRequired: number;
  emdSubmitted: number;
  emdStatus: 'Verified' | 'Deficient' | 'Exempted (MSE)';
  arithmeticValidation: 'Verified' | 'Inconsistency Detected';
  pricingAnomaly: 'Normal Range' | 'Unusually Low Bid (-32%)' | 'High Bid Deviation';
  itemBreakdown: FinancialItemBreakdown[];
}

export interface VendorDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  ocrStatus: 'Completed' | 'Processing' | 'Failed';
  pageCount: number;
  documentHash: string;
}

export interface VendorBid {
  id: string;
  tenderId: string;
  vendorName: string;
  gemVendorId: string;
  cinNumber: string;
  gstin: string;
  panNumber: string;
  bidSubmissionDate: string;
  overallComplianceScore: number;
  technicalComplianceScore: number;
  documentComplianceScore: number;
  financialComplianceScore: number;
  eligibilityComplianceScore: number;
  certificationComplianceScore: number;
  status: 'Technically Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Under Review' | 'Flagged';
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  missingDocumentsCount: number;
  deviationsCount: number;
  financialAnomaliesCount: number;
  aiRecommendation: string;
  documents: VendorDocument[];
  complianceChecks: ComplianceCheck[];
  crossDocumentValidations: CrossDocValidation[];
  certificates: CertificateValidation[];
  financialDetails: FinancialDetail;
}

export type RiskCategory = 
  | 'Document Fraud Risk'
  | 'Certificate Risk'
  | 'Eligibility Risk'
  | 'Technical Deviation'
  | 'Financial Anomaly'
  | 'Duplicate Documents'
  | 'Missing Documentation'
  | 'Cross-Document Mismatch'
  | 'Suspicious Pricing';

export interface RiskAlert {
  id: string;
  vendorId: string;
  vendorName: string;
  tenderId: string;
  tenderTitle: string;
  category: RiskCategory;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
  status: 'Active' | 'Under Review' | 'Dismissed' | 'Resolved';
  assignedTo?: string;
  clauseReference?: string;
  actionTaken?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  timeFormatted: string;
  officer: string;
  action: string;
  category: 'Ingestion' | 'AI Extraction' | 'Compliance Check' | 'Human Review' | 'Report Generated' | 'Override' | 'Security';
  details: string;
  ipAddress: string;
  session: string;
  documentRef?: string;
  aiAction?: string;
  manualDecision?: string;
  hash: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'alert' | 'success' | 'info';
  timestamp: string;
  read: boolean;
  tenderId?: string;
  vendorId?: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  citations?: Array<{
    document: string;
    page: number;
    clause: string;
    snippet: string;
  }>;
  suggestedActions?: string[];
}
