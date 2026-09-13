import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { verificationService } from '../../services/verificationService';
import { useToast } from '../../context/ToastContext';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import { StatusBadge, RiskBadge } from '../../components/common/Badge';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { CheckCircle2, Eye, DollarSign } from 'lucide-react';

export const FinanceApprovalPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [decision, setDecision] = useState('APPROVED');
  const [remarks, setRemarks] = useState('Financial sanction approved as per scheme budgetary allocations and treasury guidelines.');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getAllApplications('FINANCE_APPROVAL');
      setApplications(data || []);
    } catch (err) {
      error(err.message || 'Failed to load finance approval queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openSanctionModal = (app) => {
    setSelectedApp(app);
    setApprovedAmount(app.appliedAmount);
    setDecision('APPROVED');
  };

  const handleSanctionSubmit = async (e) => {
    e.preventDefault();
    if (!approvedAmount || Number(approvedAmount) <= 0) {
      error('Please enter a valid sanctioned amount.');
      return;
    }

    setSubmitting(true);
    try {
      await verificationService.performFinanceApproval(
        selectedApp.id,
        Number(approvedAmount),
        {
          decision,
          remarks: remarks.trim(),
        }
      );
      success(`Financial sanction granted for ${selectedApp.applicationNumber} of ${formatCurrencyINR(approvedAmount)}!`);
      setSelectedApp(null);
      loadData();
    } catch (err) {
      error(err.message || 'Finance sanction submission failed.');
    } finally {
      setSubmitting(false);
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
      key: 'schemeTitle',
      title: 'Scheme',
      render: (val) => val,
    },
    {
      key: 'regionName',
      title: 'Jurisdiction',
      render: (val, row) => `${val}, ${row.stateName}`,
    },
    {
      key: 'appliedAmount',
      title: 'Applied Grant',
      sortable: true,
      render: (val) => formatCurrencyINR(val),
    },
    {
      key: 'eligibilityScore',
      title: 'Score',
      sortable: true,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 700 }}>{val} pts</span>
          <RiskBadge riskLevel={row.riskLevel} />
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Action',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button
            variant="success"
            size="sm"
            onClick={() => openSanctionModal(row)}
          >
            Sanction Grant
          </Button>
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
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Finance Approval Queue</h2>
        <LoadingSkeleton rows={5} height={60} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={22} color="#059669" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            Finance Sanction & Treasury Grant Queue
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Review verified applications and issue formal financial grant sanctions to enable staged DBT milestone planning.
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

      {selectedApp && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedApp(null)}
          title={`Financial Sanction: ${selectedApp.applicationNumber}`}
          size="lg"
        >
          <form onSubmit={handleSanctionSubmit}>
            <div
              style={{
                backgroundColor: 'var(--gov-slate-50)',
                border: '1px solid var(--border)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Beneficiary: </span>
                <strong>{selectedApp.beneficiaryName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Scheme: </span>
                <strong>{selectedApp.schemeTitle}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Requested Grant: </span>
                <strong>{formatCurrencyINR(selectedApp.appliedAmount)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Eligibility Score: </span>
                <strong>{selectedApp.eligibilityScore} pts</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Sanctioned / Approved Grant Amount (INR) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="Enter approved amount"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
                required
              />
              <span className="form-hint">
                Treasury budget will be earmarked against this sanction value upon approval.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Finance Sanction Decision <span className="required">*</span>
              </label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="radio"
                    name="decision"
                    value="APPROVED"
                    checked={decision === 'APPROVED'}
                    onChange={(e) => setDecision(e.target.value)}
                  />
                  <span style={{ color: 'var(--gov-emerald-700)', fontWeight: 600 }}>
                    Sanction Grant (Ready for Disbursement Plan)
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="radio"
                    name="decision"
                    value="REVERIFICATION_REQUESTED"
                    checked={decision === 'REVERIFICATION_REQUESTED'}
                    onChange={(e) => setDecision(e.target.value)}
                  />
                  <span style={{ color: 'var(--gov-gold-600)', fontWeight: 600 }}>
                    Return for Audit Review
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="radio"
                    name="decision"
                    value="REJECTED"
                    checked={decision === 'REJECTED'}
                    onChange={(e) => setDecision(e.target.value)}
                  />
                  <span style={{ color: 'var(--gov-crimson-600)', fontWeight: 600 }}>
                    Reject Grant Request
                  </span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Finance Officer Remarks <span className="required">*</span></label>
              <textarea
                rows="3"
                className="form-textarea"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <Button type="button" variant="secondary" onClick={() => setSelectedApp(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant={decision === 'APPROVED' ? 'success' : 'primary'}
                loading={submitting}
              >
                Confirm Financial Sanction
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
