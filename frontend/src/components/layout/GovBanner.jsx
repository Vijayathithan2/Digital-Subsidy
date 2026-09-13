import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck } from 'lucide-react';

export const GovBanner = () => {
  const { user, quickSwitchRole, demoAccounts } = useAuth();

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        color: '#374151',
        borderBottom: '1px solid #e5e7eb',
        padding: '6px 28px',
        fontSize: '11.5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
          <span style={{ fontSize: '12px' }}>🇮🇳</span> Government of India
        </span>
        <span style={{ color: '#d1d5db' }}>•</span>
        <span style={{ color: '#6b7280', fontWeight: 500 }}>Direct Benefit Transfer & Subsidy Tracking Portal</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#ea580c', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <UserCheck size={12} /> Switch Demo Role:
        </span>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {demoAccounts.map((acc) => {
            const isActive = user?.username === acc.username;
            return (
              <button
                key={acc.username}
                onClick={() => quickSwitchRole(acc)}
                title={`Switch to ${acc.label}`}
                style={{
                  backgroundColor: isActive ? '#ee4b6c' : '#ffffff',
                  color: isActive ? '#ffffff' : '#4b5563',
                  border: isActive ? '1px solid #ee4b6c' : '1px solid #d1d5db',
                  borderRadius: 'var(--radius-xs)',
                  padding: '2px 8px',
                  fontSize: '10.5px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 1px 3px rgba(238, 75, 108, 0.25)' : 'none',
                }}
              >
                {acc.username}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
