import React from 'react';
import { AuditTimeline } from '../components/audit/AuditTimeline';

export const AuditTrail: React.FC = () => {
  return (
    <div className="space-y-6">
      <AuditTimeline />
    </div>
  );
};
