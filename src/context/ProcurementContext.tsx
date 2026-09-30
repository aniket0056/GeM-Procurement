import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Tender,
  TenderRequirement,
  VendorBid,
  RiskAlert,
  AuditLog,
  NotificationItem,
  RoleType,
  ComplianceCheck,
} from '../types';
import {
  mockCurrentUser,
  mockTenders,
  mockTenderRequirements,
  mockVendorBids,
  mockRiskAlerts,
  mockAuditLogs,
  mockNotifications,
} from '../data/mockData';
import { generateCryptoHash } from '../utils';

interface ProcurementContextType {
  currentUser: UserProfile;
  tenders: Tender[];
  selectedTenderId: string;
  selectedTender: Tender;
  requirements: Record<string, TenderRequirement[]>;
  currentRequirements: TenderRequirement[];
  vendorBids: Record<string, VendorBid[]>;
  currentVendors: VendorBid[];
  selectedVendorId: string;
  selectedVendor: VendorBid;
  riskAlerts: RiskAlert[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  isSearchOpen: boolean;
  searchQuery: string;

  // Actions
  setSelectedTenderId: (id: string) => void;
  setSelectedVendorId: (id: string) => void;
  setCurrentUserRole: (role: RoleType) => void;
  addNewTender: (tender: Tender, reqs: TenderRequirement[]) => void;
  updateRequirement: (tenderId: string, reqId: string, updates: Partial<TenderRequirement>) => void;
  approveAllRequirements: (tenderId: string) => void;
  updateComplianceCheckOverride: (
    vendorId: string,
    checkId: string,
    action: 'Approved' | 'Rejected' | 'Overridden' | 'Clarification Requested',
    rationale: string,
    comment?: string
  ) => void;
  addAuditLogEntry: (
    action: string,
    category: AuditLog['category'],
    details: string,
    docRef?: string,
    aiAction?: string,
    manualDecision?: string
  ) => void;
  updateAlertStatus: (
    alertId: string,
    status: 'Active' | 'Under Review' | 'Dismissed' | 'Resolved',
    actionTaken?: string
  ) => void;
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  toggleSearchModal: (open?: boolean) => void;
  setSearchQuery: (q: string) => void;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gem_user');
    return saved ? JSON.parse(saved) : mockCurrentUser;
  });

  const [tenders, setTenders] = useState<Tender[]>(() => {
    const saved = localStorage.getItem('gem_tenders');
    return saved ? JSON.parse(saved) : mockTenders;
  });

  const [selectedTenderId, setSelectedTenderIdState] = useState<string>(() => {
    return localStorage.getItem('gem_selected_tender') || 'GEM/2026/B/4829171';
  });

  const [requirements, setRequirements] = useState<Record<string, TenderRequirement[]>>(() => {
    const saved = localStorage.getItem('gem_requirements');
    return saved ? JSON.parse(saved) : mockTenderRequirements;
  });

  const [vendorBids, setVendorBids] = useState<Record<string, VendorBid[]>>(() => {
    const saved = localStorage.getItem('gem_vendor_bids');
    return saved ? JSON.parse(saved) : mockVendorBids;
  });

  const [selectedVendorId, setSelectedVendorIdState] = useState<string>(() => {
    return localStorage.getItem('gem_selected_vendor') || 'VND-001';
  });

  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(() => {
    const saved = localStorage.getItem('gem_alerts');
    return saved ? JSON.parse(saved) : mockRiskAlerts;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('gem_audit_logs');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('gem_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('gem_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gem_tenders', JSON.stringify(tenders));
  }, [tenders]);

  useEffect(() => {
    localStorage.setItem('gem_selected_tender', selectedTenderId);
  }, [selectedTenderId]);

  useEffect(() => {
    localStorage.setItem('gem_requirements', JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    localStorage.setItem('gem_vendor_bids', JSON.stringify(vendorBids));
  }, [vendorBids]);

  useEffect(() => {
    localStorage.setItem('gem_selected_vendor', selectedVendorId);
  }, [selectedVendorId]);

  useEffect(() => {
    localStorage.setItem('gem_alerts', JSON.stringify(riskAlerts));
  }, [riskAlerts]);

  useEffect(() => {
    localStorage.setItem('gem_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('gem_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Derived states
  const selectedTender = tenders.find(t => t.id === selectedTenderId) || tenders[0];
  const currentRequirements = requirements[selectedTenderId] || [];
  const currentVendors = vendorBids[selectedTenderId] || [];
  const selectedVendor = currentVendors.find(v => v.id === selectedVendorId) || currentVendors[0] || mockVendorBids['GEM/2026/B/4829171'][0];
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const setSelectedTenderId = (id: string) => {
    setSelectedTenderIdState(id);
    const bidsForTender = vendorBids[id] || [];
    if (bidsForTender.length > 0) {
      setSelectedVendorIdState(bidsForTender[0].id);
    }
  };

  const setSelectedVendorId = (id: string) => {
    setSelectedVendorIdState(id);
  };

  const setCurrentUserRole = (role: RoleType) => {
    setCurrentUser(prev => ({ ...prev, role }));
    addAuditLogEntry(
      `Role Changed to ${role}`,
      'Security',
      `User ${currentUser.name} switched operational context to ${role}.`,
      undefined,
      undefined,
      'Active'
    );
  };

  const addAuditLogEntry = (
    action: string,
    category: AuditLog['category'],
    details: string,
    docRef?: string,
    aiAction?: string,
    manualDecision?: string
  ) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: now.toISOString(),
      timeFormatted,
      officer: `${currentUser.name} (${currentUser.role})`,
      action,
      category,
      details,
      ipAddress: '10.24.180.44 (NIC VPN Gateway)',
      session: 'SESS-GOI-9921',
      documentRef: docRef,
      aiAction,
      manualDecision,
      hash: generateCryptoHash(`${now.toISOString()}-${action}-${details}`),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNewTender = (tender: Tender, reqs: TenderRequirement[]) => {
    setTenders(prev => [tender, ...prev]);
    setRequirements(prev => ({
      ...prev,
      [tender.id]: reqs,
    }));
    setSelectedTenderId(tender.id);

    addAuditLogEntry(
      'New Procurement Tender Created',
      'Ingestion',
      `Tender ${tender.gemBidNumber} (${tender.title}) created and ingested by ${currentUser.name}.`,
      tender.documentName
    );
  };

  const updateRequirement = (tenderId: string, reqId: string, updates: Partial<TenderRequirement>) => {
    setRequirements(prev => {
      const list = prev[tenderId] || [];
      const updated = list.map(r => (r.id === reqId ? { ...r, ...updates } : r));
      return { ...prev, [tenderId]: updated };
    });

    addAuditLogEntry(
      `Tender Requirement ${reqId} Modified`,
      'Human Review',
      `Requirement ${reqId} updated: ${JSON.stringify(updates)}`
    );
  };

  const approveAllRequirements = (tenderId: string) => {
    setRequirements(prev => {
      const list = prev[tenderId] || [];
      const updated = list.map(r => ({ ...r, status: 'Approved' as const }));
      return { ...prev, [tenderId]: updated };
    });

    addAuditLogEntry(
      'All Tender Clauses Approved by Officer',
      'Human Review',
      `Officer ${currentUser.name} verified and approved all extracted clauses for ${tenderId}.`
    );
  };

  const updateComplianceCheckOverride = (
    vendorId: string,
    checkId: string,
    action: 'Approved' | 'Rejected' | 'Overridden' | 'Clarification Requested',
    rationale: string,
    comment?: string
  ) => {
    const now = new Date();
    const timestamp = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;

    setVendorBids(prev => {
      const tenderBids = prev[selectedTenderId] || [];
      const updatedBids = tenderBids.map(v => {
        if (v.id !== vendorId) return v;
        const updatedChecks = v.complianceChecks.map(c => {
          if (c.id !== checkId) return c;
          let newStatus = c.status;
          let newReviewerStatus = c.reviewerStatus;

          if (action === 'Approved' || action === 'Overridden') {
            newStatus = 'Compliant';
            newReviewerStatus = action === 'Approved' ? 'Approved' : 'Overridden';
          } else if (action === 'Rejected') {
            newStatus = 'Non-Compliant';
            newReviewerStatus = 'Review Required';
          } else if (action === 'Clarification Requested') {
            newReviewerStatus = 'Clarification Requested';
          }

          return {
            ...c,
            status: newStatus,
            reviewerStatus: newReviewerStatus,
            humanOverride: {
              officer: `${currentUser.name} (${currentUser.role})`,
              action,
              timestamp,
              rationale,
              comment,
            },
          };
        });

        // Recalculate compliance score
        const total = updatedChecks.length;
        const compliantCount = updatedChecks.filter(c => c.status === 'Compliant').length;
        const newScore = total > 0 ? Math.round((compliantCount / total) * 100) : v.overallComplianceScore;

        return {
          ...v,
          complianceChecks: updatedChecks,
          overallComplianceScore: newScore,
        };
      });

      return {
        ...prev,
        [selectedTenderId]: updatedBids,
      };
    });

    addAuditLogEntry(
      `Compliance Finding ${action}: ${checkId}`,
      'Human Review',
      `Officer ${currentUser.name} executed ${action} with rationale: "${rationale}". Comment: "${comment || 'None'}".`,
      undefined,
      undefined,
      action
    );
  };

  const updateAlertStatus = (
    alertId: string,
    status: 'Active' | 'Under Review' | 'Dismissed' | 'Resolved',
    actionTaken?: string
  ) => {
    setRiskAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? {
              ...a,
              status,
              actionTaken: actionTaken || `Marked as ${status} by ${currentUser.name}`,
              assignedTo: status === 'Under Review' ? currentUser.name : a.assignedTo,
            }
          : a
      )
    );

    addAuditLogEntry(
      `Risk Alert Status Changed: ${alertId}`,
      'Security',
      `Alert "${alertId}" updated to ${status}. Details: ${actionTaken || 'N/A'}`
    );
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleSearchModal = (open?: boolean) => {
    setIsSearchOpen(prev => (open !== undefined ? open : !prev));
  };

  return (
    <ProcurementContext.Provider
      value={{
        currentUser,
        tenders,
        selectedTenderId,
        selectedTender,
        requirements,
        currentRequirements,
        vendorBids,
        currentVendors,
        selectedVendorId,
        selectedVendor,
        riskAlerts,
        auditLogs,
        notifications,
        unreadNotificationCount,
        isSearchOpen,
        searchQuery,

        setSelectedTenderId,
        setSelectedVendorId,
        setCurrentUserRole,
        addNewTender,
        updateRequirement,
        approveAllRequirements,
        updateComplianceCheckOverride,
        addAuditLogEntry,
        updateAlertStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toggleSearchModal,
        setSearchQuery,
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
