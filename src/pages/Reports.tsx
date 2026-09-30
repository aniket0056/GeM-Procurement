import React from 'react';
import { useProcurement } from '../context/ProcurementContext';
import { ReportBuilder } from '../components/reports/ReportBuilder';

export const Reports: React.FC = () => {
  const { selectedTender, currentVendors } = useProcurement();

  return (
    <div className="space-y-6">
      <ReportBuilder
        tender={selectedTender}
        vendors={currentVendors}
      />
    </div>
  );
};
