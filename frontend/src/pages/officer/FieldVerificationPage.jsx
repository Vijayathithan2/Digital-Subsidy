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
import { MapPin, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';

export const FieldVerificationPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [decision, setDecision] = useState('APPROVED');
  const [remarks, setRemarks] = useState('Physical ground verification conducted. Land and income proofs found accurate.');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getAllApplications();
      // Filter for field verification stage
      const fieldQueue = data.filter((a) =>
        ['FIELD_VERIFICATION', 'REVERIFICATION_REQUIRED'].includes(a.status)
      );
      setApplications(fieldQueue);
    } catch (err) {
      error(err.message || 'Failed to fetch field verification queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      error('Please provide field inspection remarks.');
      return;
    }

    setSubmitting(true);
    try {
      await verificationService.performFieldVerification(selectedApp.id, {
        decision,
        remarks: remarks.trim(),
      });
      success(`Field verification recorded for ${selectedApp.applicationNumber}: ${decision}`);
      setSelectedApp(null);
      loadData();
    } catch (err) {
      error(err.message || 'Verification submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'applicationNumber',
      title: 'App Ref',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDate(row.createdAt)}</div>
        </div>
      ),
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
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.schemeCode}</div>
        </div>
      ),
    },
    {
      key: 'regionName',
      title: 'Region',
      render: (val, row) => `${val}, ${row.stateName}`,
    },
    {
      key: 'appliedAmount',
      title: 'Applied Amount',
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
      key: 'status',
      title: 'Status',
      render: (val) => <StatusBadge status={val} />,
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
            Review & Act
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
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          Field Verification Workbench
        </h2>
        <LoadingSkeleton rows={5} height={60} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={22} color="#d97706" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            Ground & Physical Field Verification Queue
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Inspect beneficiary eligibility, identity documents, and land holdings on ground before escalating to District Review.
        </p>
      </div>

      <div className="gov-card">
        <DataTable
          columns={columns}
          data={applications}
          searchableKey="applicationNumber"
          searchPlaceholder="Search application ref or applicant..."
          pageSize={10}
        />
      </div>

      {/* Field Verification Modal */}
      {selectedApp && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedApp(null)}
          title={`Field Verification: ${selectedApp.applicationNumber}`}
          size="lg"
        >
          <form onSubmit={handleVerificationSubmit}>
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
                <span style={{ color: 'var(--text-muted)' }}>Applicant: </span>
                <strong>{selectedApp.beneficiaryName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Aadhaar: </span>
                <strong>{selectedApp.beneficiaryIdentityNumber}</strong>
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
                <span style={{ color: 'var(--text-muted)' }}>Score: </span>
                <strong>{selectedApp.eligibilityScore} pts</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Risk Category: </span>
                <RiskBadge riskLevel={selectedApp.riskLevel} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Field Inspection Official Decision <span className="required">*</span>
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
                    Recommend Approval (Forward to District)
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
                    Request Re-verification
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
                Inspection Remarks & Evidence Summary <span className="required">*</span>
              </label>
              <textarea
                rows="4"
                className="form-textarea"
                placeholder="Enter field notes, GPS geo-tag verification, and document audit details..."
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
                Submit Official Inspection
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
