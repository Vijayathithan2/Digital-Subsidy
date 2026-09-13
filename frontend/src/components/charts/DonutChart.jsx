import React from 'react';

export const DonutChart = ({
  data = [], // [{ label: 'SC', value: 30, color: '#1e3a8a' }]
  size = 180,
  strokeWidth = 24,
  centerLabel = '',
  centerSub = '',
}) => {
  const total = data.reduce((acc, cur) => acc + (Number(cur.value) || 0), 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {total === 0 ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="var(--gov-slate-200)"
              strokeWidth={strokeWidth}
            />
          ) : (
            data.map((item, idx) => {
              const val = Number(item.value) || 0;
              const percent = val / total;
              const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
              const strokeDashoffset = -circumference * accumulatedPercent;
              accumulatedPercent += percent;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color || '#2563eb'}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dasharray 0.3s ease' }}
                />
              );
            })
          )}
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {centerLabel && (
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
              {centerLabel}
            </div>
          )}
          {centerSub && (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {centerSub}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: item.color || '#2563eb',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: 'var(--gov-slate-700)', fontWeight: 500 }}>{item.label}</span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--gov-slate-900)' }}>
              {item.value} {total > 0 ? `(${((item.value / total) * 100).toFixed(1)}%)` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
