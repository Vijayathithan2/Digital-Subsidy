import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { grievanceService } from '../../services/grievanceService';
import { useToast } from '../../context/ToastContext';
import { AlertCircle, Search, Send, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export const GrievanceModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('lodge'); // 'lodge' | 'track'
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Lodge Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [category, setCategory] = useState('Disbursement Delay');
  const [applicationRef, setApplicationRef] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Track State
  const [searchTrackingNum, setSearchTrackingNum] = useState('');
  const [searching, setSearching] = useState(false);
  const [trackedGrievance, setTrackedGrievance] = useState(null);
  const [trackError, setTrackError] = useState(null);

  const { success, error } = useToast();

  const handleLodgeSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !description) {
      error('Please fill in the subject and detailed description.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await grievanceService.submitGrievance({
        applicantName,
        applicantEmail,
        applicantPhone,
        category,
        applicationRef,
        subject,
        description,
      });

      setSubmittedTicket(result);
      success(`Grievance ${result.trackingNumber} registered successfully!`);
    } catch (err) {
      error(err.message || 'Failed to submit grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!searchTrackingNum.trim()) return;

    setSearching(true);
    setTrackError(null);
    setTrackedGrievance(null);
    try {
      const item = await grievanceService.getGrievanceByTrackingNumber(searchTrackingNum);
      setTrackedGrievance(item);
    } catch (err) {
      setTrackError(err.message || 'Tracking ID not found');
    } finally {
      setSearching(false);
    }
  };

  const resetForm = () => {
    setSubmittedTicket(null);
    setSubject('');
    setDescription('');
    setApplicationRef('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="badge badge-completed">RESOLVED</span>;
      case 'IN_PROGRESS':
      case 'UNDER_INVESTIGATION':
        return <span className="badge badge-verification">IN PROGRESS</span>;
      case 'SUBMITTED':
      default:
        return <span className="badge badge-submitted">SUBMITTED</span>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Public Grievance & Appeal Redressal Portal" size="lg">
      {/* Tab Controls */}
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid var(--border-light)',
          marginBottom: '20px',
          gap: '12px',
        }}
      >
        <button
          onClick={() => { setActiveTab('lodge'); resetForm(); }}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'lodge' ? '3px solid #ee4b6c' : '3px solid transparent',
            color: activeTab === 'lodge' ? '#ee4b6c' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '13.5px',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
          }}
        >
          Lodge New Grievance
        </button>
        <button
          onClick={() => setActiveTab('track')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'track' ? '3px solid #ee4b6c' : '3px solid transparent',
            color: activeTab === 'track' ? '#ee4b6c' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '13.5px',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
          }}
        >
          Track Grievance Status
        </button>
      </div>

      {activeTab === 'lodge' && (
        <>
          {submittedTicket ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: '#10b981',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
                Grievance Successfully Registered
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Your appeal has been assigned to the District Nodal Officer for official review.
              </p>
              <div
                style={{
                  backgroundColor: 'var(--gov-slate-50)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'inline-block',
                  textAlign: 'left',
                  marginBottom: '20px',
                  minWidth: '280px',
                }}
              >
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Grievance Tracking Reference:
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#ee4b6c', letterSpacing: '0.04em' }}>
                  {submittedTicket.trackingNumber}
                </div>
              </div>
              <div>
                <Button variant="primary" onClick={resetForm}>
                  Lodge Another Grievance
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLodgeSubmit}>
              <div
                style={{
                  backgroundColor: '#fff1f2',
                  border: '1px solid #ffe4e6',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  fontSize: '12px',
                  color: '#be123c',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <ShieldAlert size={18} />
                <span>
                  Official Grievance Redressal SLA: Nodal Officers must investigate and respond to beneficiary appeals within 7 working days.
                </span>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email or Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter contact email or phone"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">
                    Grievance Category <span className="required">*</span>
                  </label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Disbursement Delay">Disbursement Delay / PFMS Issue</option>
                    <option value="e-KYC & Document Issue">e-KYC & Identity Verification Mismatch</option>
                    <option value="Eligibility Dispute">Eligibility Score Re-evaluation</option>
                    <option value="Officer Conduct / Appeal">Field Inspection Appeal</option>
                    <option value="Technical Portal Bug">Technical Portal / OTP Issue</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Application Ref (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. SUB-20260830-DEMO01"
                    value={applicationRef}
                    onChange={(e) => setApplicationRef(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Subject / Summary <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Briefly state your concern"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Detailed Description of Issue <span className="required">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Provide complete details including transaction reference or document numbers if applicable..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={submitting} icon={Send} style={{ backgroundColor: '#ee4b6c', borderColor: '#ee4b6c' }}>
                  Register Grievance
                </Button>
              </div>
            </form>
          )}
        </>
      )}

      {activeTab === 'track' && (
        <div>
          <form onSubmit={handleTrackSubmit} style={{ marginBottom: '24px' }}>
            <label className="form-label">Enter Grievance Tracking ID (e.g. GRV-2026-8891)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="GRV-XXXX-XXXX"
                value={searchTrackingNum}
                onChange={(e) => setSearchTrackingNum(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" loading={searching} icon={Search} style={{ backgroundColor: '#ee4b6c', borderColor: '#ee4b6c' }}>
                Track
              </Button>
            </div>
          </form>

          {trackError && (
            <div
              style={{
                padding: '14px',
                backgroundColor: '#fff1f2',
                border: '1px solid #ffe4e6',
                borderRadius: 'var(--radius-md)',
                color: '#be123c',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AlertCircle size={18} />
              <span>{trackError}</span>
            </div>
          )}

          {trackedGrievance && (
            <div className="gov-card" style={{ backgroundColor: 'var(--gov-slate-50)', marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {trackedGrievance.category}
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-navy-950)' }}>
                    {trackedGrievance.subject}
                  </h4>
                </div>
                {getStatusBadge(trackedGrievance.status)}
              </div>

              <div style={{ fontSize: '12.5px', color: 'var(--gov-slate-700)', marginBottom: '14px', lineHeight: 1.5 }}>
                {trackedGrievance.description}
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  fontSize: '12px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#ee4b6c" />
                  Nodal Officer Investigation Remarks:
                </div>
                <div style={{ color: 'var(--text-primary)', italic: true }}>
                  "{trackedGrievance.officerRemarks || 'Grievance is currently assigned and undergoing field verification.'}"
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Assigned To: <strong>{trackedGrievance.assignedOfficer || 'District Officer'}</strong></span>
                <span>Ref App: <strong>{trackedGrievance.applicationRef || 'N/A'}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
