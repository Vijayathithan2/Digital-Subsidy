import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import { utilizationService } from '../../services/utilizationService';
import { useToast } from '../../context/ToastContext';
import { formatCurrencyINR, formatDate, formatPercentage } from '../../utils/formatters';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Receipt, CheckCircle, FileText, Check, X } from 'lucide-react';

export const UtilizationMonitoringPage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [utilizations, setUtilizations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verification modal
  const [selectedUtil, setSelectedUtil] = useState(null);
  const [approved, setApproved] = useState(true);
  const [remarks, setRemarks] = useState('Ground expenditure receipts verified against disbursed funds.');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      try {
        const apps = await applicationService.getAllApplications();
        const activeApps = apps.filter((a) =>
          [
            'DISBURSEMENT_IN_PROGRESS',
            'FULLY_DISBURSED',
            'UTILIZATION_PENDING',
            'COMPLETED',
          ].includes(a.status)
        );
        setApplications(activeApps);
        if (activeApps.length > 0) {
          setSelectedAppId(activeApps[0].id);
          fetchUtilizations(activeApps[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        error(err.message || 'Failed to load applications.');
        setLoading(false);
      }
    };

    loadApps();
  }, []);

  const fetchUtilizations = async (appId) => {
    setLoading(true);
    try {
      const utils = await utilizationService.getUtilizationsByApplication(appId);
      setUtilizations(utils || []);
    } catch (err) {
      error(err.message || 'Failed to load utilizations.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppChange = (appId) => {
    setSelectedAppId(appId);
    fetchUtilizations(appId);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await utilizationService.verifyUtilization(selectedUtil.id, approved, remarks);
      success(`Utilization verification recorded: ${approved ? 'APPROVED' : 'REJECTED'}`);
      setSelectedUtil(null);
      fetchUtilizations(selectedAppId);
    } catch (err) {
      error(err.message || 'Utilization verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Receipt size={22} color="#059669" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            Fund Utilization & Expenditure Verification Monitor
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Audit ground purchase vouchers, inspect work completion proofs, and certify grant utilization.
        </p>
      </div>

      {/* Select Application Bar */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-slate-700)' }}>
            Select Disbursed Application:
          </label>
          <select
            className="form-select"
            style={{ maxWidth: '400px' }}
            value={selectedAppId}
            onChange={(e) => handleAppChange(e.target.value)}
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.applicationNumber} - {a.beneficiaryName} ({a.schemeCode}) [{a.status}]
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Utilization Records Table */}
      <Card title="Submitted Ground Expenditure Invoices">
        {loading ? (
          <LoadingSkeleton rows={4} height={50} />
        ) : utilizations.length > 0 ? (
          <div className="table-wrapper">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Voucher Ref</th>
                  <th>Utilized Amount</th>
                  <th>Utilization %</th>
                  <th>Invoice Document</th>
                  <th>Remarks</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {utilizations.map((u) => (
                  <tr key={u.id}>
                    <td><strong>UTIL-REC-#{u.id}</strong></td>
                    <td style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                      {formatCurrencyINR(u.utilizedAmount)}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--gov-emerald-700)' }}>
                        {formatPercentage(u.utilizationPercentage)}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={14} />
                        {u.proofDocumentPath || 'receipt.pdf'}
                      </div>
                    </td>
                    <td style={{ maxWidth: '250px', fontSize: '12px' }}>{u.remarks || '-'}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            u.verificationStatus === 'VERIFIED'
                              ? 'var(--gov-emerald-100)'
                              : 'var(--gov-gold-100)',
                          color:
                            u.verificationStatus === 'VERIFIED'
                              ? 'var(--gov-emerald-700)'
                              : 'var(--gov-gold-700)',
                        }}
                      >
                        {u.verificationStatus}
                      </span>
                    </td>
                    <td>
                      {u.verificationStatus === 'PENDING' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedUtil(u);
                            setApproved(true);
                          }}
                        >
                          Audit & Verify
                        </Button>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Verified by {u.verifiedByUsername}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No utilization proof submitted for this application yet.
          </div>
        )}
      </Card>

      {/* Verify Utilization Modal */}
      {selectedUtil && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedUtil(null)}
          title={`Verify Utilization Voucher: UTIL-REC-#${selectedUtil.id}`}
        >
          <form onSubmit={handleVerifySubmit}>
            <div
              style={{
                backgroundColor: 'var(--gov-slate-50)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                fontSize: '13px',
              }}
            >
              <div>
                Amount to Verify: <strong>{formatCurrencyINR(selectedUtil.utilizedAmount)}</strong>
              </div>
              <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Proof Document: {selectedUtil.proofDocumentPath}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Audit Decision <span className="required">*</span></label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="radio"
                    name="approved"
                    checked={approved}
                    onChange={() => setApproved(true)}
                  />
                  <span style={{ color: 'var(--gov-emerald-700)', fontWeight: 600 }}>
                    Approve Utilization (Endorse Ground Work)
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="radio"
                    name="approved"
                    checked={!approved}
                    onChange={() => setApproved(false)}
                  />
                  <span style={{ color: 'var(--gov-crimson-600)', fontWeight: 600 }}>
                    Reject Voucher
                  </span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Verification Remarks <span className="required">*</span></label>
              <textarea
                rows="3"
                className="form-textarea"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <Button type="button" variant="secondary" onClick={() => setSelectedUtil(null)}>
                Cancel
              </Button>
              <Button type="submit" variant={approved ? 'success' : 'danger'} loading={submitting}>
                Submit Audit Certification
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
