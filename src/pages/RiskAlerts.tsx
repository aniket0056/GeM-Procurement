import React from 'react';
import { RiskIntelligenceView } from '../components/risk/RiskIntelligenceView';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const RiskAlerts: React.FC = () => {
  return (
    <div className="space-y-6">
      <RiskIntelligenceView />
      <DisclaimerBanner />
    </div>
  );
};
