import React from 'react';
import { WORKFLOW_STAGES, STATUS_CONFIG } from '../../constants/applicationStatus';
import { Check, X, AlertCircle } from 'lucide-react';

export const WorkflowStepper = ({ currentStatus }) => {
  const currentConfig = STATUS_CONFIG[currentStatus] || { stepIndex: 0 };
  const currentStepIndex = currentConfig.stepIndex;
  const isRejected = currentStatus === 'REJECTED';
  const isReverification = currentStatus === 'REVERIFICATION_REQUIRED';

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 20px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)',
        overflowX: 'auto',
      }}
    >
      <div style={{ minWidth: '850px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Background progress bar line */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              right: '20px',
              height: '3px',
              backgroundColor: 'var(--gov-slate-200)',
              zIndex: 1,
            }}
          />

          {/* Active progress bar line */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              width: `${Math.max(0, Math.min(100, (currentStepIndex / (WORKFLOW_STAGES.length - 1)) * 100))}%`,
              height: '3px',
              backgroundColor: isRejected ? 'var(--gov-crimson-600)' : 'var(--gov-emerald-600)',
              zIndex: 1,
              transition: 'width 0.4s ease',
            }}
          />

          {WORKFLOW_STAGES.map((stage, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            let circleBg = 'var(--surface)';
            let circleBorder = 'var(--gov-slate-300)';
            let iconColor = 'var(--gov-slate-400)';

            if (isCompleted) {
              circleBg = 'var(--gov-emerald-600)';
              circleBorder = 'var(--gov-emerald-600)';
              iconColor = '#ffffff';
            } else if (isCurrent) {
              if (isRejected) {
                circleBg = 'var(--gov-crimson-600)';
                circleBorder = 'var(--gov-crimson-600)';
                iconColor = '#ffffff';
              } else if (isReverification) {
                circleBg = 'var(--gov-gold-500)';
                circleBorder = 'var(--gov-gold-500)';
                iconColor = '#ffffff';
              } else {
                circleBg = 'var(--gov-navy-800)';
                circleBorder = 'var(--gov-navy-800)';
                iconColor = '#ffffff';
              }
            }

            return (
              <div
                key={stage.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2,
                  width: '76px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: circleBg,
                    border: `2px solid ${circleBorder}`,
                    color: iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                    marginBottom: '8px',
                    boxShadow: isCurrent ? '0 0 0 4px rgba(30, 58, 138, 0.15)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCompleted ? (
                    <Check size={16} />
                  ) : isCurrent && isRejected ? (
                    <X size={16} />
                  ) : isCurrent && isReverification ? (
                    <AlertCircle size={16} />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isCurrent ? 700 : isCompleted ? 600 : 500,
                    color: isCurrent
                      ? isRejected
                        ? 'var(--gov-crimson-600)'
                        : 'var(--gov-navy-950)'
                      : isCompleted
                      ? 'var(--gov-emerald-700)'
                      : 'var(--gov-slate-400)',
                    lineHeight: 1.2,
                  }}
                >
                  {stage.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
