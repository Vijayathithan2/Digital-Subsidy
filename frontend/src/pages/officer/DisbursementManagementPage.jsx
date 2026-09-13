import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { disbursementService } from '../../services/disbursementService';
import { milestoneService } from '../../services/milestoneService';
import { useToast } from '../../context/ToastContext';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import { StatusBadge, MilestoneBadge } from '../../components/common/Badge';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { CreditCard, Send, Plus, CheckCircle, Eye, RefreshCw } from 'lucide-react';

export const DisbursementManagementPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Milestone Plan Modal
  const [planModalApp, setPlanModalApp] = useState(null);
  const [creatingPlan, setCreatingPlan] = useState(false);

  // Inspect & Release Funds Modal
  const [activePlanApp, setActivePlanApp] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [releaseMilestone, setReleaseMilestone] = useState(null);
  const [releaseAmount, setReleaseAmount] = useState('');
  const [releasing, setReleasing] = useState(false);

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getAllApplications();
      // Filter for disbursement lifecycle stages
      const disbQueue = data.filter((a) =>
        [
          'DISBURSEMENT_PLANNED',
          'MILESTONE_PENDING',
          'DISBURSEMENT_IN_PROGRESS',
          'FULLY_DISBURSED',
          'UTILIZATION_PENDING',
        ].includes(a.status)
      );
      setApplications(disbQueue);
    } catch (err) {
      error(err.message || 'Failed to load disbursement queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateStandardPlan = async (app) => {
    const total = Number(app.approvedAmount);
    const m1 = Math.round(total * 0.4);
    const m2 = Math.round(total * 0.4);
    const m3 = total - m1 - m2;

    const planBody = {
      applicationId: app.id,
      totalPlannedAmount: total,
      milestones: [
        {
          sequenceNumber: 1,
          title: 'Stage 1: Documentation & Initial Sanction Tranche',
          milestoneType: 'DOCUMENTATION',
          scheduledAmount: m1,
          dueDate: '2026-09-30',
          complianceCondition: 'Aadhaar Identity and verified DBT bank account active',
        },
        {
          sequenceNumber: 2,
          title: 'Stage 2: Ground Work & Interim Inspection Tranche',
          milestoneType: 'GROUND_VERIFICATION',
          scheduledAmount: m2,
          dueDate: '2026-10-31',
          complianceCondition: 'Field Officer physical inspection geo-tagged photograph verified',
        },
        {
          sequenceNumber: 3,
          title: 'Stage 3: Project Completion & Full Utilization',
          milestoneType: 'FINAL_COMPLETION',
          scheduledAmount: m3,
          dueDate: '2026-12-15',
          complianceCondition: 'Full receipt utilization audit approved by District / Treasury',
        },
      ],
    };

    setCreatingPlan(true);
    try {
      await disbursementService.createPlan(planBody);
      success(`3-Stage Milestone Disbursement Plan created for ${app.applicationNumber}!`);
      setPlanModalApp(null);
      loadData();
    } catch (err) {
      error(err.message || 'Failed to create disbursement plan.');
    } finally {
      setCreatingPlan(false);
    }
  };

  const openPlanDetailsModal = async (app) => {
    setActivePlanApp(app);
    try {
      const plan = await disbursementService.getPlanByApplicationId(app.id);
      setPlanDetails(plan);
    } catch (err) {
      error(err.message || 'Failed to load disbursement plan details.');
    }
  };

  const handleVerifyMilestoneCompliance = async (milestoneId) => {
    try {
      await milestoneService.markComplianceSatisfied(
        milestoneId,
        'Inspected and verified compliance by Treasury / Field Officer'
      );
      success('Milestone compliance verified! Funds eligible for DBT release.');
      const updated = await disbursementService.getPlanByApplicationId(activePlanApp.id);
      setPlanDetails(updated);
      loadData();
    } catch (err) {
      error(err.message || 'Failed to verify compliance.');
    }
  };

  const handleExecuteRelease = async (e) => {
    e.preventDefault();
    if (!releaseAmount || Number(releaseAmount) <= 0) {
      error('Please enter a valid release amount.');
      return;
    }

    setReleasing(true);
    try {
      const res = await disbursementService.releaseMilestoneFunds(releaseMilestone.id, {
        amount: Number(releaseAmount),
        paymentMode: 'DIRECT_BENEFIT_TRANSFER',
        remarks: 'Direct Benefit Transfer executed via simulated Treasury DBT Gateway',
      });
      success(
        `₹${Number(releaseAmount).toLocaleString('en-IN')} released via Treasury DBT! UTR: ${
          res.transactionRefNumber
        }`
      );
      setReleaseMilestone(null);
      const updated = await disbursementService.getPlanByApplicationId(activePlanApp.id);
      setPlanDetails(updated);
      loadData();
    } catch (err) {
      error(err.message || 'Fund release failed.');
    } finally {
      setReleasing(false);
    }
  };

  const columns = [
    {
      key: 'applicationNumber',
      title: 'App Ref',
      sortable: true,
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{val}</span>,
    },
    {
      key: 'beneficiaryName',
      title: 'Beneficiary',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.beneficiaryIdentityNumber}</div>
        </div>
      ),
    },
    {
      key: 'schemeCode',
      title: 'Scheme',
      render: (val) => val,
    },
    {
      key: 'approvedAmount',
      title: 'Sanctioned Grant',
      sortable: true,
      render: (val) => (
        <span style={{ fontWeight: 700, color: 'var(--gov-emerald-700)' }}>{formatCurrencyINR(val)}</span>
      ),
    },
    {
      key: 'status',
      title: 'Disbursement Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          {row.status === 'DISBURSEMENT_PLANNED' ? (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => handleCreateStandardPlan(row)}
              loading={creatingPlan}
            >
              Generate 3-Stage Plan
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              icon={CreditCard}
              onClick={() => openPlanDetailsModal(row)}
            >
              Manage Tranches & DBT
            </Button>
          )}
          <Link to={`/beneficiary/applications/${row.id}`}>
            <Button variant="secondary" size="sm" icon={Eye} />
          </Link>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          Disbursement & DBT Management Workbench
        </h2>
        <LoadingSkeleton rows={5} height={60} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard size={22} color="#0284c7" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            Disbursement Plans & Direct Benefit Transfer (DBT) Cell
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Create staged milestone disbursement plans, enforce compliance conditions, and trigger Treasury DBT releases.
        </p>
      </div>

      <div className="gov-card">
        <DataTable
          columns={columns}
          data={applications}
          searchableKey="applicationNumber"
          searchPlaceholder="Search application ref..."
          pageSize={10}
        />
      </div>

      {/* Plan Tranches & DBT Release Modal */}
      {activePlanApp && planDetails && (
        <Modal
          isOpen={true}
          onClose={() => {
            setActivePlanApp(null);
            setPlanDetails(null);
          }}
          title={`Milestone Plan: ${activePlanApp.applicationNumber}`}
          size="lg"
        >
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                padding: '14px',
                backgroundColor: 'var(--gov-slate-50)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Sanctioned:</span>
                <div style={{ fontWeight: 700 }}>{formatCurrencyINR(planDetails.totalPlannedAmount)}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Total Released:</span>
                <div style={{ fontWeight: 700, color: 'var(--gov-emerald-700)' }}>
                  {formatCurrencyINR(planDetails.totalReleasedAmount)}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Remaining:</span>
                <div style={{ fontWeight: 700 }}>{formatCurrencyINR(planDetails.totalRemainingAmount)}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <div style={{ fontWeight: 700 }}>{planDetails.status}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {planDetails.milestones?.map((m) => (
                <div
                  key={m.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: m.releaseStatus === 'RELEASED' ? '#f0fdf4' : 'var(--surface)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--gov-navy-950)' }}>
                        Stage {m.sequenceNumber}: {m.title}
                      </span>
                      <MilestoneBadge status={m.releaseStatus} />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Scheduled: <strong>{formatCurrencyINR(m.scheduledAmount)}</strong> | Due: {formatDate(m.dueDate)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)', marginTop: '2px' }}>
                      Compliance Condition: {m.complianceCondition}
                    </div>
                    {m.transactionRefNumber && (
                      <div style={{ fontSize: '11px', color: 'var(--gov-emerald-700)', fontWeight: 700, marginTop: '4px' }}>
                        RBI/PFMS UTR: {m.transactionRefNumber} (Released {formatDate(m.releasedAt)})
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {!m.complianceSatisfied && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleVerifyMilestoneCompliance(m.id)}
                      >
                        Verify Compliance
                      </Button>
                    )}

                    {m.complianceSatisfied && m.releaseStatus !== 'RELEASED' && (
                      <Button
                        variant="success"
                        size="sm"
                        icon={Send}
                        onClick={() => {
                          setReleaseMilestone(m);
                          setReleaseAmount(m.scheduledAmount);
                        }}
                      >
                        Release Funds (DBT)
                      </Button>
                    )}

                    {m.releaseStatus === 'RELEASED' && (
                      <span style={{ fontSize: '12px', color: 'var(--gov-emerald-700)', fontWeight: 700 }}>
                        ✓ Disbursed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setActivePlanApp(null);
                  setPlanDetails(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Execute DBT Release Confirmation Modal */}
      {releaseMilestone && (
        <Modal
          isOpen={true}
          onClose={() => setReleaseMilestone(null)}
          title={`Execute Treasury DBT Fund Release`}
        >
          <form onSubmit={handleExecuteRelease}>
            <div
              style={{
                backgroundColor: 'var(--gov-navy-50)',
                border: '1px solid var(--gov-navy-100)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                fontSize: '12px',
                color: 'var(--gov-navy-900)',
              }}
            >
              You are about to release <strong>{formatCurrencyINR(releaseAmount)}</strong> to the beneficiary's verified bank
              account via Direct Benefit Transfer (RBI/PFMS Treasury simulation).
            </div>

            <div className="form-group">
              <label className="form-label">
                Release Amount (INR) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={releaseAmount}
                onChange={(e) => setReleaseAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <input
                type="text"
                className="form-input"
                disabled
                value="DIRECT_BENEFIT_TRANSFER (Treasury PFMS/RBI)"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <Button type="button" variant="secondary" onClick={() => setReleaseMilestone(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="success" loading={releasing} icon={Send}>
                Confirm & Release via DBT
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
