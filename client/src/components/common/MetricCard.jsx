import React from 'react';

export const MetricCard = ({ title, value, subtext, status, icon: Icon }) => {
  return (
    <div className="dcs-kv-item">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="dcs-kv-label">{title}</span>
        {Icon && <Icon size={16} color="var(--slate-400)" />}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span className="dcs-kv-value">{value || '-'}</span>
        {status && (
          <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>
            ({status})
          </span>
        )}
      </div>
      {subtext && (
        <span style={{ fontSize: '11.5px', color: 'var(--slate-500)', marginTop: '2px' }}>
          {subtext}
        </span>
      )}
    </div>
  );
};

export default MetricCard;
