import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import { schemeService } from '../../services/schemeService';
import { beneficiaryService } from '../../services/beneficiaryService';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import { StatusBadge, KycBadge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  FileText,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  PlusCircle,
  CreditCard,
  UserCheck,
} from 'lucide-react';

export const BeneficiaryDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeSchemes, setActiveSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, appsRes, schemesRes] = await Promise.allSettled([
          beneficiaryService.getMyProfile(),
          applicationService.getMyApplications(),
          schemeService.getActiveSchemes(),
        ]);

        if (profileRes.status === 'fulfilled') setProfile(profileRes.value);
        if (appsRes.status === 'fulfilled') setApplications(appsRes.value || []);
        if (schemesRes.status === 'fulfilled') setActiveSchemes(schemesRes.value || []);
      } catch (err) {
        console.error('Error loading beneficiary dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute metrics
  const totalApproved = applications.reduce(
    (acc, cur) => acc + (Number(cur.approvedAmount) || 0),
    0
  );
  const pendingApps = applications.filter((a) =>
    ['SUBMITTED', 'FIELD_VERIFICATION', 'DISTRICT_REVIEW', 'FINANCE_APPROVAL'].includes(a.status)
  ).length;
  const completedApps = applications.filter((a) => a.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Beneficiary Direct Benefit Transfer Portal</h2>
        </div>
        <LoadingSkeleton rows={5} height={80} />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fff1f4 100%)',
          color: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          border: '1px solid #fecdd3',
          boxShadow: '0 2px 8px rgba(238, 75, 108, 0.08)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>
              Welcome, {profile?.fullName || user?.fullName || user?.username}!
            </h2>
            {profile && <KycBadge status={profile.kycStatus} />}
          </div>
          <p style={{ fontSize: '13.5px', color: '#4b5563' }}>
            {profile
              ? `Aadhaar: ${profile.identityNumber} | Region: ${profile.regionName || ''}, ${profile.stateName || ''} | Category: ${profile.category}`
              : 'Complete your beneficiary profile to automatically check eligibility against welfare schemes.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {!profile && (
            <Link to="/beneficiary/profile">
              <Button variant="secondary" icon={UserCheck}>
                Register Profile
              </Button>
            </Link>
          )}
          <Link to="/beneficiary/schemes">
            <Button variant="success" icon={PlusCircle}>
              Explore & Apply Schemes
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Applications</span>
            <span className="stat-value">{applications.length}</span>
            <span className="stat-subtext">Submitted across departments</span>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gov-navy-50)', color: 'var(--gov-navy-700)' }}>
            <FileText size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Sanctioned Amount</span>
            <span className="stat-value">{formatCurrencyINR(totalApproved)}</span>
            <span className="stat-subtext">Total government grants approved</span>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gov-emerald-50)', color: 'var(--gov-emerald-600)' }}>
            <CreditCard size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Under Verification</span>
            <span className="stat-value">{pendingApps}</span>
            <span className="stat-subtext">Field / District / Finance</span>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gov-gold-50)', color: 'var(--gov-gold-600)' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Completed Lifecycles</span>
            <span className="stat-value">{completedApps}</span>
            <span className="stat-subtext">100% disbursed & utilized</span>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gov-emerald-50)', color: 'var(--gov-emerald-700)' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Main Grid: My Recent Applications & Available Schemes */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: My Recent Applications */}
        <Card
          title="My Applications Status"
          action={
            <Link to="/beneficiary/applications">
              <Button variant="outline" size="sm" icon={ArrowRight}>
                View All
              </Button>
            </Link>
          }
        >
          {applications.length > 0 ? (
            <div className="table-wrapper">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Application Ref</th>
                    <th>Scheme</th>
                    <th>Applied Amount</th>
                    <th>Eligibility Score</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                        {app.applicationNumber}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{app.schemeTitle}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.schemeCode}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{formatCurrencyINR(app.appliedAmount)}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--gov-navy-700)' }}>
                          {app.eligibilityScore} pts
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td>
                        <Link to={`/beneficiary/applications/${app.id}`}>
                          <Button variant="secondary" size="sm">
                            Track
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No Subsidy Applications Yet"
              description="Browse the active government schemes below and submit your first grant subsidy application."
              action={
                <Link to="/beneficiary/schemes">
                  <Button variant="primary" size="sm">
                    Browse Welfare Schemes
                  </Button>
                </Link>
              }
            />
          )}
        </Card>

        {/* Right Column: Featured Welfare Schemes */}
        <Card
          title="Active Government Schemes"
          action={
            <Link to="/beneficiary/schemes" style={{ fontSize: '12px', fontWeight: 600 }}>
              All Schemes ({activeSchemes.length})
            </Link>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeSchemes.slice(0, 3).map((scheme) => (
              <div
                key={scheme.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                    {scheme.title}
                  </h4>
                  <span className="badge badge-submitted">{scheme.code}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.4 }}>
                  {scheme.department}
                </p>
                <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Grant Slab: </span>
                  <strong>{formatCurrencyINR(scheme.minGrantAmount)}</strong> to{' '}
                  <strong>{formatCurrencyINR(scheme.maxGrantAmount)}</strong>
                </div>
                <Link to={`/beneficiary/schemes/${scheme.id}`}>
                  <Button variant="outline" size="sm" style={{ width: '100%' }}>
                    Inspect Criteria & Apply
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
