import React, { useState, useEffect } from 'react';
import { milestoneService } from '../../services/milestoneService';
import { useToast } from '../../context/ToastContext';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import { MilestoneBadge } from '../../components/common/Badge';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { CheckSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const MilestoneInspectionPage = () => {
  const [overdueMilestones, setOverdueMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await milestoneService.getOverdueMilestones();
      setOverdueMilestones(data || []);
    } catch (err) {
      error(err.message || 'Failed to load overdue milestones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyCompliance = async (milestone) => {
    setCompletingId(milestone.id);
    try {
      await milestoneService.markComplianceSatisfied(
        milestone.id,
        'Compliance verified during scheduled inspection'
      );
      success(`Compliance verified for milestone: ${milestone.title}`);
      loadData();
    } catch (err) {
      error(err.message || 'Failed to verify milestone compliance.');
    } finally {
      setCompletingId(null);
    }
  };

  const columns = [
    {
      key: 'sequenceNumber',
      title: 'Seq',
      sortable: true,
      render: (val) => <strong>#{val}</strong>,
    },
    {
      key: 'title',
      title: 'Milestone Title',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Type: {row.milestoneType}</div>
        </div>
      ),
    },
    {
      key: 'scheduledAmount',
      title: 'Tranche Amount',
      sortable: true,
      render: (val) => <span style={{ fontWeight: 700 }}>{formatCurrencyINR(val)}</span>,
    },
    {
      key: 'dueDate',
      title: 'Scheduled Due Date',
      sortable: true,
      render: (val) => (
        <span style={{ color: 'var(--gov-crimson-600)', fontWeight: 600 }}>{formatDate(val)}</span>
      ),
    },
    {
      key: 'complianceCondition',
      title: 'Required Condition',
      render: (val) => <span style={{ fontSize: '12px' }}>{val || 'Standard proof verification'}</span>,
    },
    {
      key: 'releaseStatus',
      title: 'Release Status',
      render: (val) => <MilestoneBadge status={val} />,
    },
    {
      key: 'actions',
      title: 'Action',
      render: (_, row) => (
        <div>
          {!row.complianceSatisfied ? (
            <Button
              variant="primary"
              size="sm"
              loading={completingId === row.id}
              onClick={() => handleVerifyCompliance(row)}
            >
              Verify Compliance
            </Button>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--gov-emerald-700)', fontWeight: 600 }}>
              ✓ Ready for Release
            </span>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          Milestones Compliance Monitoring
        </h2>
        <LoadingSkeleton rows={5} height={60} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={22} color="#dc2626" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            Compliance Milestones & Overdue Inspection Monitor
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Scheduled compliance engine tracking overdue project tranches and enabling officer compliance clearance.
        </p>
      </div>

      <div className="gov-card">
        <DataTable
          columns={columns}
          data={overdueMilestones}
          searchableKey="title"
          searchPlaceholder="Search milestone title..."
          pageSize={10}
        />
      </div>
    </div>
  );
};
