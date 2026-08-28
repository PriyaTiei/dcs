import React from 'react';
import { formatStandardDateTime } from '../../utils/dateUtils';
import MetricCard from '../common/MetricCard';
import SkeletonLoader from '../common/SkeletonLoader';

export const AssemblySection = ({ oracleData, shippingRow, loading }) => {
  if (loading) {
    return (
      <div className="dcs-card">
        <div className="dcs-card-header">
          <h3 className="dcs-card-title">Assembly & Shipment Progression</h3>
        </div>
        <SkeletonLoader count={4} height={40} />
      </div>
    );
  }

  if (!oracleData?.data) {
    return null;
  }

  // Filter out EGNO and extract timeline events
  const historyEvents = oracleData.data.filter((item) => item[17] !== 'EGNO');

  const dispatchDate = shippingRow && shippingRow[3] ? formatStandardDateTime(shippingRow[3]) : 'Not Dispatched';

  return (
    <div className="dcs-card">
      <div className="dcs-card-header">
        <h3 className="dcs-card-title">
          <span>Assembly Line Progression & Shipment</span>
        </h3>
        <span className="status-pill ok">Line Verified</span>
      </div>

      <div className="dcs-kv-grid" style={{ marginBottom: '18px' }}>
        <MetricCard
          title="Shipment Status"
          value={dispatchDate}
          subtext="Oracle Historical Record"
        />
        <MetricCard
          title="Main Line (MTB)"
          value="Under Progress"
          subtext="Main Assembly Gate"
        />
        <MetricCard
          title="Total Events Logged"
          value={historyEvents.length}
          subtext="Assembly Tracking Checkpoints"
        />
      </div>

      <h4 style={{ fontSize: '14px', color: 'var(--slate-700)', marginBottom: '10px' }}>
        Checkpoint Arrival Sequence
      </h4>

      <div className="dcs-table-container">
        <table className="dcs-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Station / Checkpoint Event</th>
              <th>Arrival Date & Time</th>
              <th style={{ textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {historyEvents.map((item, index) => (
              <tr key={index}>
                <td style={{ color: 'var(--slate-400)', fontWeight: '600' }}>{index + 1}</td>
                <td style={{ fontWeight: '600', color: 'var(--primary-800)' }}>{item[17]}</td>
                <td>{item[21] ? formatStandardDateTime(item[21]) : '-'}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="status-pill ok" style={{ fontSize: '11px', padding: '2px 8px' }}>
                    Completed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssemblySection;
