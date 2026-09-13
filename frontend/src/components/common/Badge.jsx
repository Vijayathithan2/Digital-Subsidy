import React from 'react';
import { STATUS_CONFIG } from '../../constants/applicationStatus';

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status || 'UNKNOWN',
    badgeClass: 'badge-draft',
  };

  return <span className={`badge ${config.badgeClass}`}>{config.label}</span>;
};

export const RiskBadge = ({ riskLevel }) => {
  let bg = '#e2e8f0';
  let color = '#334155';

  if (riskLevel === 'LOW') {
    bg = '#dcfce7';
    color = '#15803d';
  } else if (riskLevel === 'MEDIUM') {
    bg = '#fef3c7';
    color = '#b45309';
  } else if (riskLevel === 'HIGH_VALUE') {
    bg = '#ffedd5';
    color = '#c2410c';
  } else if (riskLevel === 'FLAGGED') {
    bg = '#fee2e2';
    color = '#b91c1c';
  }

  return (
    <span
      className="badge"
      style={{
        backgroundColor: bg,
        color: color,
        border: `1px solid ${color}33`,
      }}
    >
      {riskLevel || 'LOW'}
    </span>
  );
};

export const KycBadge = ({ status }) => {
  let bg = '#fef3c7';
  let color = '#b45309';

  if (status === 'VERIFIED') {
    bg = '#dcfce7';
    color = '#15803d';
  } else if (status === 'REJECTED') {
    bg = '#fee2e2';
    color = '#b91c1c';
  }

  return (
    <span className="badge" style={{ backgroundColor: bg, color: color }}>
      KYC: {status || 'PENDING'}
    </span>
  );
};

export const MilestoneBadge = ({ status }) => {
  let bg = '#f1f5f9';
  let color = '#475569';

  if (status === 'RELEASED') {
    bg = '#dcfce7';
    color = '#15803d';
  } else if (status === 'ELIGIBLE_FOR_RELEASE') {
    bg = '#e0e7ff';
    color = '#4338ca';
  } else if (status === 'OVERDUE') {
    bg = '#fee2e2';
    color = '#b91c1c';
  }

  return (
    <span className="badge" style={{ backgroundColor: bg, color: color }}>
      {status ? status.replace(/_/g, ' ') : 'PENDING'}
    </span>
  );
};
