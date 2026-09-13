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
import { Building, CheckCircle2, Eye, ShieldAlert } from 'lucide-react';

export const DistrictReviewPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [decision, setDecision] = useState('APPROVED');
  const [remarks, setRemarks] = useState('District Magistrate administrative scrutiny satisfied. Field verification report endorsed.');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getAllApplications('DISTRICT_REVIEW');
      setApplications(data || []);
    } catch (err) {
      error(err.message || 'Failed to load district review applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      error('Please enter district review remarks.');
      return;
    }

    setSubmitting(true);
    try {
      await verificationService.performDistrictReview(selectedApp.id, {
        decision,
        remarks: remarks.trim(),
      });
      success(`District review recorded for ${selectedApp.applicationNumber}: ${decision}`);
      setSelectedApp(null);
      loadData();
    } catch (err) {
      error(err.message || 'District review submission failed.');
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
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedApp(row);
              setDecision('APPROVED');
            }}
          >
            District Review
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
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>District Review Queue</h2>
        <LoadingSkeleton rows={5} height={60} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building size={22} color="#ca8a04" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            District Magistrate Review & Endorsement Queue
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Review ground verification results and endorse applications for final Finance sanction and treasury disbursement.
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
          title={`District Review: ${selectedApp.applicationNumber}`}
          size="lg"
        >
          <form onSubmit={handleReviewSubmit}>
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
                <strong>{selectedApp.beneficiaryName}</strong> ({selectedApp.beneficiaryIdentityNumber})
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Scheme: </span>
                <strong>{selectedApp.schemeTitle}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Applied Amount: </span>
                <strong>{formatCurrencyINR(selectedApp.appliedAmount)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Eligibility Score: </span>
                <strong>{selectedApp.eligibilityScore} pts</strong> (
                <RiskBadge riskLevel={selectedApp.riskLevel} />)
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                District Review Action <span className="required">*</span>
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
                    Endorse & Escalate to Finance Officer
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
                    Return to Field Officer
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
                    Reject Application
                  </span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                District Scrutiny Endorsement Remarks <span className="required">*</span>
              </label>
              <textarea
                rows="4"
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
                variant={decision === 'APPROVED' ? 'success' : decision === 'REJECTED' ? 'danger' : 'primary'}
                loading={submitting}
              >
                Submit District Endorsement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
