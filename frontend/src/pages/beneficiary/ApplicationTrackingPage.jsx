import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { verificationService } from '../../services/verificationService';
import { disbursementService } from '../../services/disbursementService';
import { utilizationService } from '../../services/utilizationService';
import { useToast } from '../../context/ToastContext';
import { formatCurrencyINR, formatDate, formatDateTime, formatPercentage } from '../../utils/formatters';
import { StatusBadge, RiskBadge, MilestoneBadge } from '../../components/common/Badge';
import { WorkflowStepper } from '../../components/workflow/WorkflowStepper';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  CreditCard,
  Building,
  ShieldCheck,
  Send,
  ExternalLink,
} from 'lucide-react';

export const ApplicationTrackingPage = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [disbursementPlan, setDisbursementPlan] = useState(null);
  const [utilizations, setUtilizations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [utilizationModalOpen, setUtilizationModalOpen] = useState(false);

  // Document Upload Form
  const [docType, setDocType] = useState('IDENTITY_PROOF');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  // Utilization Form
  const [utilAmount, setUtilAmount] = useState('');
  const [proofPath, setProofPath] = useState('');
  const [utilRemarks, setUtilRemarks] = useState('');
  const [submittingUtil, setSubmittingUtil] = useState(false);

  // Scoring trigger
  const [evaluating, setEvaluating] = useState(false);

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const appData = await applicationService.getApplicationById(id);
      setApp(appData);

      // Load related asynchronous records
      const [verRes, planRes, utilRes] = await Promise.allSettled([
        verificationService.getVerificationsForApplication(id),
        disbursementService.getPlanByApplicationId(id),
        utilizationService.getUtilizationsByApplication(id),
      ]);

      if (verRes.status === 'fulfilled') setVerifications(verRes.value || []);
      if (planRes.status === 'fulfilled') setDisbursementPlan(planRes.value || null);
      if (utilRes.status === 'fulfilled') setUtilizations(utilRes.value || []);
    } catch (err) {
      error(err.message || 'Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleEvaluateEligibility = async () => {
    setEvaluating(true);
    try {
      const result = await applicationService.evaluateEligibility(id);
      success(
        `Eligibility Rules Evaluated! Total Score: ${result.totalScore} / 100. Status: ${
          result.eligible ? 'Eligible for Grant' : 'Ineligible'
        }`
      );
      loadData();
    } catch (err) {
      error(err.message || 'Scoring evaluation failed.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!fileName.trim()) {
      error('Please enter a document file name.');
      return;
    }

    setUploading(true);
    try {
      await applicationService.attachDocument(
        id,
        docType,
        fileName.trim(),
        'application/pdf',
        `uploads/documents/${fileName.trim()}`
      );
      success('Document attached to application record.');
      setUploadModalOpen(false);
      setFileName('');
      loadData();
    } catch (err) {
      error(err.message || 'Document attachment failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleUtilizationSubmit = async (e) => {
    e.preventDefault();
    if (!utilAmount || Number(utilAmount) <= 0) {
      error('Please specify a valid utilized amount.');
      return;
    }

    setSubmittingUtil(true);
    try {
      await utilizationService.submitUtilization(id, {
        utilizedAmount: Number(utilAmount),
        proofDocumentPath: proofPath || `uploads/receipts/util_app_${id}.pdf`,
        remarks: utilRemarks,
      });
      success('Fund utilization invoice recorded successfully!');
      setUtilizationModalOpen(false);
      setUtilAmount('');
      setProofPath('');
      setUtilRemarks('');
      loadData();
    } catch (err) {
      error(err.message || 'Failed to submit utilization report.');
    } finally {
      setSubmittingUtil(false);
    }
  };

  if (loading || !app) {
    return (
      <div>
        <LoadingSkeleton rows={5} height={80} />
      </div>
    );
  }

  return (
    <div>
      {/* Top Breadcrumb & Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/beneficiary/applications">
            <Button variant="secondary" size="sm" icon={ArrowLeft}>
              Back
            </Button>
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
                Application: {app.applicationNumber}
              </h2>
              <StatusBadge status={app.status} />
              <RiskBadge riskLevel={app.riskLevel} />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Submitted on {formatDateTime(app.createdAt)}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {app.status === 'SUBMITTED' && (
            <Button
              variant="primary"
              onClick={handleEvaluateEligibility}
              loading={evaluating}
              icon={ShieldCheck}
            >
              Run Automated Eligibility Scoring
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setUploadModalOpen(true)}
            icon={Upload}
          >
            Attach Verification Document
          </Button>

          {['DISBURSEMENT_IN_PROGRESS', 'FULLY_DISBURSED', 'UTILIZATION_PENDING'].includes(app.status) && (
            <Button
              variant="success"
              onClick={() => setUtilizationModalOpen(true)}
              icon={Receipt}
            >
              Submit Fund Utilization Proof
            </Button>
          )}
        </div>
      </div>

      {/* 11-Step Workflow Stepper */}
      <WorkflowStepper currentStatus={app.status} />

      {/* Overview Information Cards */}
      <div className="grid-cols-2" style={{ gap: '20px', marginBottom: '24px' }}>
        <Card title="Applicant & Jurisdiction Details">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Applicant Name:</span>
              <div style={{ fontWeight: 700 }}>{app.beneficiaryName}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Aadhaar Identity:</span>
              <div style={{ fontWeight: 700 }}>{app.beneficiaryIdentityNumber}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Region / District:</span>
              <div style={{ fontWeight: 600 }}>{app.regionName}, {app.stateName}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Eligibility Score:</span>
              <div style={{ fontWeight: 800, color: 'var(--gov-navy-800)' }}>
                {app.eligibilityScore} / 100 pts
              </div>
            </div>
          </div>
        </Card>

        <Card title="Financial Sanction Summary">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Scheme Code:</span>
              <div style={{ fontWeight: 700 }}>{app.schemeCode}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Scheme Name:</span>
              <div style={{ fontWeight: 600 }}>{app.schemeTitle}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Applied Grant Amount:</span>
              <div style={{ fontWeight: 700 }}>{formatCurrencyINR(app.appliedAmount)}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Approved Grant Amount:</span>
              <div style={{ fontWeight: 800, color: 'var(--gov-emerald-700)' }}>
                {formatCurrencyINR(app.approvedAmount)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Verification Stages History */}
      <Card title="Multi-Tier Verification & Sanction Audit Trail" style={{ marginBottom: '24px' }}>
        {verifications.length > 0 ? (
          <div className="table-wrapper">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Decision</th>
                  <th>Inspecting Officer</th>
                  <th>Remarks / Ground Audit</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((v) => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 700 }}>{v.stage}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: v.decision === 'APPROVED' ? 'var(--gov-emerald-100)' : 'var(--gov-crimson-100)',
                          color: v.decision === 'APPROVED' ? 'var(--gov-emerald-700)' : 'var(--gov-crimson-700)',
                        }}
                      >
                        {v.decision}
                      </span>
                    </td>
                    <td>{v.verifiedByUsername}</td>
                    <td style={{ maxWidth: '300px' }}>{v.remarks || '-'}</td>
                    <td>{formatDateTime(v.verifiedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Verification will commence once the application passes automated scoring checks.
          </div>
        )}
      </Card>

      {/* Staged Disbursement Plan & Milestones */}
      {disbursementPlan && (
        <Card title="Disbursement Schedule & DBT Tranches" style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              padding: '14px 18px',
              backgroundColor: 'var(--gov-slate-50)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
              fontSize: '13px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Total Planned Sanction: </span>
              <strong>{formatCurrencyINR(disbursementPlan.totalPlannedAmount)}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Total Released (DBT): </span>
              <strong style={{ color: 'var(--gov-emerald-700)' }}>
                {formatCurrencyINR(disbursementPlan.totalReleasedAmount)}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Remaining Balance: </span>
              <strong>{formatCurrencyINR(disbursementPlan.totalRemainingAmount)}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Plan Status: </span>
              <span className="badge badge-submitted">{disbursementPlan.status}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {disbursementPlan.milestones?.map((m) => (
              <div
                key={m.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  backgroundColor: m.releaseStatus === 'RELEASED' ? '#f0fdf4' : 'var(--surface)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--gov-navy-900)', fontSize: '14px' }}>
                      Milestone {m.sequenceNumber}: {m.title}
                    </span>
                    <MilestoneBadge status={m.releaseStatus} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Amount: <strong>{formatCurrencyINR(m.scheduledAmount)}</strong> | Due: {formatDate(m.dueDate)} | Type: {m.milestoneType}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)', marginTop: '4px' }}>
                    Compliance Condition: <em>{m.complianceCondition || 'Mandatory standard compliance inspection'}</em>
                  </div>
                  {m.transactionRefNumber && (
                    <div style={{ fontSize: '12px', color: 'var(--gov-emerald-700)', fontWeight: 700, marginTop: '6px' }}>
                      Treasury DBT UTR: {m.transactionRefNumber} (Released on {formatDate(m.releasedAt)})
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: m.complianceSatisfied ? 'var(--gov-emerald-700)' : 'var(--gov-gold-600)' }}>
                    {m.complianceSatisfied ? '✓ Compliance Satisfied' : 'Pending Inspection'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Fund Utilization Receipts */}
      <Card title="Ground Expenditure & Fund Utilization Records">
        {utilizations.length > 0 ? (
          <div className="table-wrapper">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Utilized Amount</th>
                  <th>Percentage of Released</th>
                  <th>Proof Document</th>
                  <th>Verification Status</th>
                  <th>Inspected By</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {utilizations.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                      {formatCurrencyINR(u.utilizedAmount)}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--gov-emerald-700)' }}>
                        {formatPercentage(u.utilizationPercentage)}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', color: 'var(--gov-navy-700)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={14} />
                        {u.proofDocumentPath || 'receipt.pdf'}
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: u.verificationStatus === 'VERIFIED' ? 'var(--gov-emerald-100)' : 'var(--gov-gold-100)',
                          color: u.verificationStatus === 'VERIFIED' ? 'var(--gov-emerald-700)' : 'var(--gov-gold-700)',
                        }}
                      >
                        {u.verificationStatus}
                      </span>
                    </td>
                    <td>{u.verifiedByUsername || 'Pending Review'}</td>
                    <td>{formatDateTime(u.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No utilization receipts uploaded yet. Beneficiaries must upload utilization vouchers after receiving grant tranches.
          </div>
        )}
      </Card>

      {/* Document Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Attach Verification Document"
      >
        <form onSubmit={handleUploadDocument}>
          <div className="form-group">
            <label className="form-label">Document Type <span className="required">*</span></label>
            <select
              className="form-select"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              required
            >
              <option value="IDENTITY_PROOF">Identity Proof (Aadhaar / Voter ID)</option>
              <option value="INCOME_CERTIFICATE">Official Income Certificate</option>
              <option value="LAND_RECORD">Land Holding Record (7/12 Extract / Patta)</option>
              <option value="BANK_PASSBOOK">Bank Account Passbook / Cancelled Cheque</option>
              <option value="UTILIZATION_PROOF">Ground Work Photo / Purchase Invoices</option>
              <option value="OTHER">Other Government Certification</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Document File Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. income_certificate_2026.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <Button type="button" variant="secondary" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={uploading} icon={Upload}>
              Attach Document
            </Button>
          </div>
        </form>
      </Modal>

      {/* Submit Utilization Modal */}
      <Modal
        isOpen={utilizationModalOpen}
        onClose={() => setUtilizationModalOpen(false)}
        title="Submit Fund Utilization & Invoices"
      >
        <form onSubmit={handleUtilizationSubmit}>
          <div className="form-group">
            <label className="form-label">Utilized Amount (INR) <span className="required">*</span></label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="Amount spent on ground"
              value={utilAmount}
              onChange={(e) => setUtilAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Proof / Invoice Document Reference</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. equipment_purchase_receipt_50000.pdf"
              value={proofPath}
              onChange={(e) => setProofPath(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Remarks / Description of Work</label>
            <textarea
              rows="3"
              className="form-textarea"
              placeholder="Describe work completed with the grant..."
              value={utilRemarks}
              onChange={(e) => setUtilRemarks(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <Button type="button" variant="secondary" onClick={() => setUtilizationModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" loading={submittingUtil} icon={Send}>
              Submit Utilization Proof
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
