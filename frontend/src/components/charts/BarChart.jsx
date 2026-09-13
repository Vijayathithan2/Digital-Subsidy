import React from 'react';
import { formatCurrencyINR } from '../../utils/formatters';

export const BarChart = ({
  items = [], // [{ label: 'Agri', value1: 50000000, value2: 25000000, label1: 'Budget', label2: 'Released' }]
  height = 220,
}) => {
  const maxVal = Math.max(
    ...items.flatMap((i) => [Number(i.value1) || 0, Number(i.value2) || 0]),
    1
  );

  return (
    <div style={{ width: '100%' }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--gov-navy-800)', borderRadius: '2px' }} />
          <span style={{ color: 'var(--gov-slate-700)', fontWeight: 600 }}>Total Sanctioned Budget</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--gov-emerald-600)', borderRadius: '2px' }} />
          <span style={{ color: 'var(--gov-slate-700)', fontWeight: 600 }}>Released via Treasury DBT</span>
        </div>
      </div>

      {/* Bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          height: `${height}px`,
          borderBottom: '2px solid var(--gov-slate-200)',
          paddingBottom: '8px',
          gap: '16px',
        }}
      >
        {items.map((item, idx) => {
          const h1 = Math.max(4, ((item.value1 || 0) / maxVal) * (height - 30));
          const h2 = Math.max(4, ((item.value2 || 0) / maxVal) * (height - 30));

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                maxWidth: '120px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100%' }}>
                <div
                  title={`Budget: ${formatCurrencyINR(item.value1)}`}
                  style={{
                    width: '18px',
                    height: `${h1}px`,
                    backgroundColor: 'var(--gov-navy-800)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.3s ease',
                  }}
                />
                <div
                  title={`Released: ${formatCurrencyINR(item.value2)}`}
                  style={{
                    width: '18px',
                    height: `${h2}px`,
                    backgroundColor: 'var(--gov-emerald-600)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.3s ease',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--gov-slate-700)',
                  marginTop: '8px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
                title={item.label}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
