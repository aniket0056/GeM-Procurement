import {
  TenderRequirement,
  ComplianceCheck,
  CopilotMessage,
  RequirementCategory,
} from '../types';

export interface AIProcessingStep {
  id: number;
  label: string;
  detail: string;
  status: 'pending' | 'in-progress' | 'completed';
  durationMs: number;
}

export const TENDER_EXTRACTION_STEPS: AIProcessingStep[] = [
  { id: 1, label: 'Uploading Procurement Tender Document', detail: 'Parsing binary stream & verifying PDF header', status: 'pending', durationMs: 400 },
  { id: 2, label: 'Running High-Resolution OCR Engine', detail: 'Optical character recognition with Tesseract/LayoutLMv3', status: 'pending', durationMs: 700 },
  { id: 3, label: 'Extracting Tender Clauses & Legal Sections', detail: 'Tokenizing document layout and identifying section headers', status: 'pending', durationMs: 600 },
  { id: 4, label: 'Identifying Eligibility & PQC Criteria', detail: 'Mapping mandatory past performance and turnover clauses', status: 'pending', durationMs: 500 },
  { id: 5, label: 'Extracting Technical Specifications', detail: 'Extracting operating parameters, tolerances, ASTM/API standards', status: 'pending', durationMs: 600 },
  { id: 6, label: 'Extracting Financial & EMD Conditions', detail: 'Parsing EMD thresholds, BG formats, payment terms, LD conditions', status: 'pending', durationMs: 500 },
  { id: 7, label: 'Synthesizing Compliance Rule Engine Profiles', detail: 'Generating structured JSON compliance schemas for bid comparison', status: 'pending', durationMs: 500 },
];

export const BID_ANALYSIS_STEPS: AIProcessingStep[] = [
  { id: 1, label: 'Document Ingestion & Hash Generation', detail: 'Calculating cryptographic SHA-256 signatures for tamper prevention', status: 'pending', durationMs: 400 },
  { id: 2, label: 'OCR Processing & Text Tokenization', detail: 'Multi-threaded layout-aware text extraction across all PDF/DOCX pages', status: 'pending', durationMs: 700 },
  { id: 3, label: 'Document Classification & Entity Tagging', detail: 'Classifying Technical Datasheets, Audited Balance Sheets, GST & ISO Certificates', status: 'pending', durationMs: 500 },
  { id: 4, label: 'Information Extraction & Parameter Normalization', detail: 'Normalizing technical units (bar, psi, °C, MT, Crores)', status: 'pending', durationMs: 600 },
  { id: 5, label: 'Clause-by-Clause Semantic Mapping', detail: 'Comparing vendor statements against mandatory tender requirements', status: 'pending', durationMs: 800 },
  { id: 6, label: 'Cross-Document Consistency Verification', detail: 'Cross-validating Company Name, GSTIN, and Turnover between bids & CA certs', status: 'pending', durationMs: 600 },
  { id: 7, label: 'Certificate Validity & Expiry Audit', detail: 'Verifying accreditation body authentications and active dates', status: 'pending', durationMs: 500 },
  { id: 8, label: 'Financial BOQ Arithmetic & Anomaly Detection', detail: 'Flagging unusually low bids, tax discrepancies, and rate deviations', status: 'pending', durationMs: 600 },
  { id: 9, label: 'Compliance Scoring & Explainability Generation', detail: 'Computing weighted compliance index and explainable audit observations', status: 'pending', durationMs: 600 },
];

export class AIComplianceService {
  /**
   * Simulates AI-powered tender requirement extraction
   */
  static extractSampleRequirements(tenderId: string): TenderRequirement[] {
    const categories: RequirementCategory[] = [
      'Eligibility Criteria',
      'Technical Requirements',
      'Financial Requirements',
      'Required Documents',
      'Certifications',
      'Experience Requirements',
      'Turnover Requirements',
      'EMD Requirements',
      'Delivery Requirements',
      'Warranty Requirements',
    ];

    return [
      {
        id: `REQ-${Date.now()}-1`,
        tenderId,
        clauseCode: 'ELG-01',
        category: 'Eligibility Criteria',
        requirement: 'Bidder must possess a minimum 5 years continuous experience in supplying industrial high-pressure valves to Indian oil & gas PSUs.',
        type: 'Mandatory',
        confidence: 97,
        tenderReference: 'Section 4.2, Page 18, Clause 4.2.1',
        status: 'Approved',
        thresholdValue: '>= 5.0 Years',
      },
      {
        id: `REQ-${Date.now()}-2`,
        tenderId,
        clauseCode: 'TECH-01',
        category: 'Technical Requirements',
        requirement: 'Valve body material must strictly conform to ASTM A182 Gr. F316/F316L with NACE MR0175 sour gas compliance certification.',
        type: 'Mandatory',
        confidence: 99,
        tenderReference: 'Section 6.1.4, Page 24, Clause 6.1.4(b)',
        status: 'Approved',
        thresholdValue: 'ASTM A182 F316 / NACE MR0175',
      },
      {
        id: `REQ-${Date.now()}-3`,
        tenderId,
        clauseCode: 'TECH-04',
        category: 'Technical Requirements',
        requirement: 'The supplied valve assembly must support a minimum operating pressure rating of 150 bar (Class 900) at 120°C.',
        type: 'Mandatory',
        confidence: 98,
        tenderReference: 'Section 7.1.1, Page 31, Clause 7.1.1',
        status: 'Flagged',
        thresholdValue: '>= 150 bar (Class 900)',
      },
      {
        id: `REQ-${Date.now()}-4`,
        tenderId,
        clauseCode: 'FIN-01',
        category: 'Turnover Requirements',
        requirement: 'Average annual financial turnover during last 3 financial years must be at least ₹15.00 Crores with valid UDIN CA certificate.',
        type: 'Mandatory',
        confidence: 95,
        tenderReference: 'Section 5.1.2, Page 20, Clause 5.1.2',
        status: 'Approved',
        thresholdValue: '>= ₹15.00 Cr / Year',
      },
      {
        id: `REQ-${Date.now()}-5`,
        tenderId,
        clauseCode: 'DOC-08',
        category: 'Required Documents',
        requirement: 'Manufacturer Authorization Form (MAF) specifically issued for this GeM Bid Number is mandatory for all non-OEM bidders.',
        type: 'Mandatory',
        confidence: 100,
        tenderReference: 'Section 4.3.4, Page 19, Clause 4.3.4',
        status: 'Flagged',
        thresholdValue: 'OEM MAF Form',
      },
      {
        id: `REQ-${Date.now()}-6`,
        tenderId,
        clauseCode: 'CERT-01',
        category: 'Certifications',
        requirement: 'Valid ISO 9001:2015 Quality Management System Certification from an IAF accredited body.',
        type: 'Mandatory',
        confidence: 99,
        tenderReference: 'Section 4.4.1, Page 21, Clause 4.4.1',
        status: 'Approved',
        thresholdValue: 'ISO 9001:2015',
      },
      {
        id: `REQ-${Date.now()}-7`,
        tenderId,
        clauseCode: 'DELV-01',
        category: 'Delivery Requirements',
        requirement: 'Delivery of all equipment within 16 weeks from PO issuance to ONGC Nhava Base Logistics Facility, Maharashtra.',
        type: 'Mandatory',
        confidence: 94,
        tenderReference: 'Section 8.1, Page 36, Clause 8.1.2',
        status: 'Approved',
        thresholdValue: '<= 16 Weeks',
      },
      {
        id: `REQ-${Date.now()}-8`,
        tenderId,
        clauseCode: 'WAR-01',
        category: 'Warranty Requirements',
        requirement: 'Comprehensive on-site warranty of 24 months from commissioning or 30 months from dispatch date.',
        type: 'Mandatory',
        confidence: 96,
        tenderReference: 'Section 9.2, Page 39, Clause 9.2.1',
        status: 'Approved',
        thresholdValue: '24 Months On-site',
      },
    ];
  }

  /**
   * Explainable AI query engine for Copilot Chat
   */
  static generateCopilotResponse(query: string, activeChecks: ComplianceCheck[]): CopilotMessage {
    const lower = query.toLowerCase();

    if (lower.includes('tech-04') || lower.includes('flagged') || lower.includes('pressure')) {
      return {
        id: `MSG-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'Clause TECH-04 requires a minimum continuous operating pressure of 150 bar (Class 900) at 120°C as stipulated in Section 7.1.1 (Page 31). In the submitted technical datasheet for Alpha Engineering Pvt Ltd, Section 3.2 on Page 14 indicates a continuous operating pressure of 145 bar. This results in a negative variance of -5 bar (-3.33%). The AI Compliance Engine flagged this clause as high-risk, recommending human technical review or requesting formal clarification.',
        citations: [
          {
            document: 'Alpha_Technical_Specification_Datasheet.pdf',
            page: 14,
            clause: 'TECH-04',
            snippet: 'Maximum design pressure: 160 bar; Continuous maximum operating pressure: 145 bar @ 120°C ambient rating.',
          },
          {
            document: 'Tender_ONGC_MH_Valves_2026_Rev2.pdf',
            page: 31,
            clause: 'Section 7.1.1',
            snippet: 'The supplied valve assembly must support a minimum operating pressure rating of 150 bar (Class 900) at 120°C.',
          }
        ],
        suggestedActions: [
          'Open Split-Screen Document Viewer for TECH-04',
          'Dispatch Clarification Memo via GeM Portal',
          'Override Finding with Committee Justification',
        ]
      };
    }

    if (lower.includes('missing') || lower.includes('document')) {
      return {
        id: `MSG-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'The AI Verification Engine identified missing mandatory documentation across 2 bidders:\n\n1. **PetroTech Solutions**: Missing Manufacturer Authorization Form (MAF/OEM Authorization) under clause DOC-08. Since PetroTech is a distributor, this document is strictly required by GeM General Terms.\n2. **Bharat Industrial Systems**: Missing Make in India Local Content Class-I Chartered Engineer Certificate.\n\nAll other mandatory statutory documents (GSTIN, PAN, EMD Proof) have been verified for remaining bidders.',
        citations: [
          {
            document: 'Tender_ONGC_MH_Valves_2026_Rev2.pdf',
            page: 19,
            clause: 'DOC-08',
            snippet: 'In case bidder is authorized distributor/reseller, OEM MAF is mandatory.',
          }
        ],
        suggestedActions: [
          'View Missing Documents Filter',
          'Generate Shortfall Notice',
        ]
      };
    }

    if (lower.includes('financial') || lower.includes('anomaly') || lower.includes('price') || lower.includes('lowest')) {
      return {
        id: `MSG-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'Financial Bid Verification highlights:\n\n• **Alpha Engineering**: Quoted ₹4.82 Cr (-5.49% vs Estimated Value ₹5.10 Cr). EMD of ₹10.2 Lakh verified. Arithmetic validation 100% consistent.\n• **Bharat Industrial Systems**: Flagged for Pricing Anomaly. Quoted ₹3.95 Cr (-22.55% overall), with Item 1 (6" Ball Valves) priced 32% lower than the median competing market rate. Risk of non-performance or low-balling detected.\n• **National Pipeline Equipment**: Quoted ₹4.98 Cr (-2.35% variance). Full financial consistency.',
        citations: [
          {
            document: 'Bharat_Price_Schedule_BOQ.xlsx',
            page: 2,
            clause: 'FIN-Price-Item-01',
            snippet: 'Unit price: ₹2,85,000 per unit (Benchmark: ₹4,20,000 to ₹4,50,000).',
          }
        ],
        suggestedActions: [
          'Open Financial Bid Verification',
          'Inspect Unusually Low Price Breakdown',
        ]
      };
    }

    if (lower.includes('compare') || lower.includes('ranking') || lower.includes('winner')) {
      return {
        id: `MSG-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'Vendor Compliance Comparative Summary:\n\n1. **National Pipeline Equipment Ltd**: 95% Overall Compliance | Risk: Low | Missing Docs: 0\n2. **Alpha Engineering Pvt Ltd**: 92% Overall Compliance | Risk: Low | Deviations: 1 (TECH-04: 145 bar)\n3. **Bharat Industrial Systems**: 87% Overall Compliance | Risk: Medium | Financial Anomaly Detected\n4. **Vertex Engineering India**: 84% Overall Compliance | Risk: Medium | Certificate Expired\n5. **PetroTech Solutions**: 71% Overall Compliance | Risk: High | Missing OEM MAF\n\n*Note: In accordance with Ministry Guidelines, this AI compliance analysis assists evaluation. Final procurement qualification decisions remain with the designated Tender Committee.*',
        suggestedActions: [
          'Open Full Vendor Comparison Table',
          'Export Comparison Matrix to PDF',
        ]
      };
    }

    // Default Fallback
    return {
      id: `MSG-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Based on the active procurement tender analysis for GEM/2026/B/4829171:\n\n• 47 total tender clauses extracted with 97.4% average parser confidence.\n• 5 vendor bids verified with 1 high-risk deviation (TECH-04 on Alpha Engineering), 1 expired certificate (PetroTech Solutions), and 1 financial pricing alert (Bharat Industrial Systems).\n• All findings are backed by page-level document citations with human override capability.`,
      suggestedActions: [
        'Why was TECH-04 flagged?',
        'Show missing documents.',
        'Compare technical specifications.',
        'Explain financial anomalies.',
      ]
    };
  }
}
