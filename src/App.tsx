import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProcurementProvider } from './context/ProcurementContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Procurements } from './pages/Procurements';
import { NewProcurement } from './pages/NewProcurement';
import { BidUpload } from './pages/BidUpload';
import { BidVerification } from './pages/BidVerification';
import { ComplianceAnalysis } from './pages/ComplianceAnalysis';
import { VendorComparison } from './pages/VendorComparison';
import { RiskAlerts } from './pages/RiskAlerts';
import { Reports } from './pages/Reports';
import { AuditTrail } from './pages/AuditTrail';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <ProcurementProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/" element={<Login />} />

          {/* Authenticated Application Shell */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/procurements" element={<Procurements />} />
            <Route path="/new" element={<NewProcurement />} />
            <Route path="/upload" element={<BidUpload />} />
            <Route path="/verification" element={<BidVerification />} />
            <Route path="/compliance" element={<ComplianceAnalysis />} />
            <Route path="/vendors" element={<VendorComparison />} />
            <Route path="/alerts" element={<RiskAlerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit" element={<AuditTrail />} />
            <Route path="/copilot" element={<AIAssistant />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ProcurementProvider>
  );
};

export default App;
