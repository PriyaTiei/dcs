import React from 'react';
import { formatStandardDateTime } from '../../utils/dateUtils';
import MetricCard from '../common/MetricCard';

export const CrankInfoCard = ({ crankinfo }) => {
  if (!crankinfo) return null;

  return (
    <div className="dcs-card">
      <div className="dcs-card-header">
        <h3 className="dcs-card-title">Crank Case Stiffner</h3>
        <span className="status-pill ok">Assembled</span>
      </div>

      <div className="dcs-kv-grid">
        <MetricCard
          title="Crank Housing Number"
          value={crankinfo.crankHousingNum}
          subtext="Housing Serial Identification"
        />
        <MetricCard
          title="Crank Housing Casting No."
          value={crankinfo.crankHousingCastingNum}
          subtext="Foundry Casting Batch"
        />
        <MetricCard
          title="Assembly Date & Time"
          value={formatStandardDateTime(crankinfo.createdAt)}
          subtext="Line Assembly Timestamp"
        />
      </div>
    </div>
  );
};

export default CrankInfoCard;
