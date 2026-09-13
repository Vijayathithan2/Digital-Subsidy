import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import { milestoneService } from '../../services/milestoneService';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import { StatusBadge, RiskBadge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Shield,
  MapPin,
  Building,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Receipt,
  ArrowRight,
} from 'lucide-react';

export const OfficerDashboard = () => {
  const { user, roles } = useAuth();
  const [applications, setApplications] = useState([]);
  const [overdueMilestones, setOverdueMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appsRes, overdueRes] = await Promise.allSettled([
          applicationService.getAllApplications(),
          milestoneService.getOverdueMilestones(),
        ]);

        if (appsRes.status === 'fulfilled') setApplications(appsRes.value || []);
        if (overdueRes.status === 'fulfilled') setOverdueMilestones(overdueRes.value || []);
      } catch (err) {
        console.error('Failed to load officer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fieldQueueCount = applications.filter((a) =>
    ['FIELD_VERIFICATION', 'REVERIFICATION_REQUIRED'].includes(a.status)
  ).length;
  const districtQueueCount = applications.filter((a) => a.status === 'DISTRICT_REVIEW').length;
  const financeQueueCount = applications.filter((a) => a.status === 'FINANCE_APPROVAL').length;
  const disbursementQueueCount = applications.filter((a) =>
    ['DISBURSEMENT_PLANNED', 'MILESTONE_PENDING', 'DISBURSEMENT_IN_PROGRESS'].includes(a.status)
  ).length;

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          Verification & Sanction Officer Workbench
        </h2>
        <LoadingSkeleton rows={4} height={80} />
      </div>
    );
  }

  return (
    <div>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fff1f4 100%)',
          color: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '24px',
          border: '1px solid #fecdd3',
          boxShadow: '0 2px 8px rgba(238, 75, 108, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Shield size={22} color="#ee4b6c" />
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827' }}>
            Officer Operations & Verification Workbench
          </h2>
        </div>
        <p style={{ fontSize: '13.5px', color: '#4b5563' }}>
          Logged in as <strong style={{ color: '#ee4b6c' }}>{user?.fullName || user?.username}</strong> | Direct Benefit Transfer Governance Cell
        </p>
      </div>

      {/* Stage KPI Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        <Link to="/officer/field-verification" style={{ textDecoration: 'none' }}>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Field Queue</span>
              <span className="stat-value">{fieldQueueCount}</span>
              <span className="stat-subtext">Ground checks pending</span>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'var(--gov-gold-50)', color: 'var(--gov-gold-600)' }}>
              <MapPin size={22} />
            </div>
          </div>
        </Link>

        <Link to="/officer/district-review" style={{ textDecoration: 'none' }}>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">District Review</span>
              <span className="stat-value">{districtQueueCount}</span>
              <span className="stat-subtext">Magistrate scrutiny</span>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'var(--gov-navy-50)', color: 'var(--gov-navy-700)' }}>
              <Building size={22} />
            </div>
          </div>
        </Link>

        <Link to="/officer/finance-approval" style={{ textDecoration: 'none' }}>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Finance Sanction</span>
              <span className="stat-value">{financeQueueCount}</span>
              <span className="stat-subtext">Awaiting grant sanction</span>
            </div>
            <div className="stat-icon" style={{ backgroundColor: 'var(--gov-emerald-50)', color: 'var(--gov-emerald-600)' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
        </Link>

        <Link to="/officer/disbursements" style={{ textDecoration: 'none' }}>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Disbursement Plans</span>
              <span className="stat-value">{disbursementQueueCount}</span>
              <span className="stat-subtext">Tranches & DBT</span>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <CreditCard size={22} />
            </div>
          </div>
        </Link>
      </div>

      {/* Main Table: Applications Pending Verification Action */}
      <Card
        title="Active Applications Under Scrutiny"
        action={
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {applications.length} total records
          </span>
        }
      >
        <div className="table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>App Ref</th>
                <th>Applicant</th>
                <th>Scheme</th>
                <th>Region</th>
                <th>Applied Amount</th>
                <th>Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 10).map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{a.applicationNumber}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.beneficiaryName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.beneficiaryIdentityNumber}</div>
                  </td>
                  <td>{a.schemeCode}</td>
                  <td>{a.regionName}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrencyINR(a.appliedAmount)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontWeight: 700 }}>{a.eligibilityScore} pts</span>
                      <RiskBadge riskLevel={a.riskLevel} />
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td>
                    <Link to={`/beneficiary/applications/${a.id}`}>
                      <Button variant="secondary" size="sm">
                        Inspect
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
