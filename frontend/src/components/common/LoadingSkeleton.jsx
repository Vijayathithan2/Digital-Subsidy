import React from 'react';

export const LoadingSkeleton = ({ rows = 4, height = 24, className = '' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className={className}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          style={{
            height: `${height}px`,
            backgroundColor: 'var(--gov-slate-200)',
            borderRadius: 'var(--radius-md)',
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      ))}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};
