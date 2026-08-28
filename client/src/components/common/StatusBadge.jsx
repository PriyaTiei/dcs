import React from 'react';

export const StatusBadge = ({ status, text }) => {
  const normalized = (status || text || '').toString().trim().toUpperCase();

  let badgeType = 'info';
  let label = text || status || '-';

  if (['OK', 'PASS', 'GOOD', 'COMPLETED', '2'].includes(normalized)) {
    badgeType = 'ok';
    label = text || 'OK';
  } else if (
    ['NG', 'FAIL', 'LL NG', 'UL NG', 'LL2 NG', 'UL2 NG', 'ERR', '1', '4', '9', 'C', 'D'].includes(
      normalized
    )
  ) {
    badgeType = 'ng';
    if (normalized === '1') label = 'LL NG';
    else if (normalized === '4') label = 'UL NG';
    else if (normalized === '9') label = 'LL2 NG';
    else if (normalized === 'C') label = 'UL2 NG';
    else if (normalized === 'D') label = 'ERR';
  } else if (['WARNING', 'WARN', 'PENDING', 'UNDER PROGRESS'].includes(normalized)) {
    badgeType = 'warning';
  }

  return (
    <span className={`status-pill ${badgeType}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor:
            badgeType === 'ok'
              ? 'var(--status-ok-solid)'
              : badgeType === 'ng'
              ? 'var(--status-ng-solid)'
              : badgeType === 'warning'
              ? 'var(--status-warn-solid)'
              : 'var(--status-info-solid)',
        }}
      />
      {label}
    </span>
  );
};

export default StatusBadge;
