import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import { StatusBadge, RiskBadge } from '../../components/common/Badge';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { PlusCircle, Eye } from 'lucide-react';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const columns = [
    {
      key: 'applicationNumber',
      title: 'Application Ref',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDate(row.createdAt)}</div>
        </div>
      ),
    },
    {
      key: 'schemeTitle',
      title: 'Scheme',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.schemeCode}</div>
        </div>
      ),
    },
    {
      key: 'regionName',
      title: 'Jurisdiction',
      render: (val, row) => `${val || ''}, ${row.stateName || ''}`,
    },
    {
      key: 'appliedAmount',
      title: 'Applied Amount',
      sortable: true,
      render: (val) => formatCurrencyINR(val),
    },
    {
      key: 'approvedAmount',
      title: 'Approved Grant',
      sortable: true,
      render: (val) => (
        <span style={{ fontWeight: 700, color: Number(val) > 0 ? 'var(--gov-emerald-700)' : 'var(--text-muted)' }}>
          {formatCurrencyINR(val)}
        </span>
      ),
    },
    {
      key: 'eligibilityScore',
      title: 'Score',
      sortable: true,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 700, color: 'var(--gov-navy-800)' }}>{val} pts</span>
          <RiskBadge riskLevel={row.riskLevel} />
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      title: 'Action',
      render: (_, row) => (
        <Link to={`/beneficiary/applications/${row.id}`}>
          <Button variant="secondary" size="sm" icon={Eye}>
            Track
          </Button>
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          My Subsidy Applications
        </h2>
        <LoadingSkeleton rows={5} height={60} />
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            My Subsidy Applications
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Track real-time multi-stage verification, eligibility evaluation, and DBT disbursement milestones
          </p>
        </div>

        <Link to="/beneficiary/schemes">
          <Button variant="primary" icon={PlusCircle}>
            Apply for New Scheme
          </Button>
        </Link>
      </div>

      <div className="gov-card">
        <DataTable
          columns={columns}
          data={applications}
          searchableKey="applicationNumber"
          searchPlaceholder="Search by Application Ref..."
          pageSize={8}
        />
      </div>
    </div>
  );
};
