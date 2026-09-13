import React, { useState, useEffect } from 'react';
import { auditService } from '../../services/auditService';
import { formatDateTime } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/Badge';
import { DataTable } from '../../components/tables/DataTable';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ShieldAlert, Search } from 'lucide-react';

export const AuditTrailPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await auditService.getAllAuditLogs();
      setLogs(data || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const columns = [
    {
      key: 'timestamp',
      title: 'Timestamp (IST)',
      sortable: true,
      render: (val) => (
        <span style={{ fontSize: '12px', color: 'var(--gov-slate-700)', fontWeight: 600 }}>
          {formatDateTime(val)}
        </span>
      ),
    },
    {
      key: 'username',
      title: 'Official / User',
      sortable: true,
      render: (val) => <strong style={{ color: 'var(--gov-navy-900)' }}>{val}</strong>,
    },
    {
      key: 'action',
      title: 'Action Performed',
      sortable: true,
      render: (val) => (
        <span
          style={{
            fontWeight: 700,
            fontSize: '11px',
            backgroundColor: 'var(--gov-navy-50)',
            color: 'var(--gov-navy-800)',
            padding: '3px 8px',
            borderRadius: '4px',
          }}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'entityName',
      title: 'Entity Target',
      render: (val, row) => (
        <span style={{ fontSize: '12px' }}>
          {val} <strong>#{row.entityId}</strong>
        </span>
      ),
    },
    {
      key: 'previousState',
      title: 'Previous State',
      render: (val) => <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{val || '-'}</span>,
    },
    {
      key: 'newState',
      title: 'New State',
      render: (val) => (val ? <StatusBadge status={val} /> : '-'),
    },
    {
      key: 'details',
      title: 'Audit Remarks / Evidence',
      render: (val) => (
        <span style={{ fontSize: '12px', color: 'var(--gov-slate-600)', maxWidth: '280px', display: 'block' }}>
          {val || '-'}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          System Audit Trail & Compliance Log
        </h2>
        <LoadingSkeleton rows={5} height={60} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={22} color="#1e3a8a" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            Immutable System Audit Trail & Compliance Log
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Tamper-evident chronological log of every lifecycle state transition, officer inspection remark, and financial sanction.
        </p>
      </div>

      <div className="gov-card">
        <DataTable
          columns={columns}
          data={logs}
          searchableKey="username"
          searchPlaceholder="Filter by user or officer..."
          pageSize={12}
        />
      </div>
    </div>
  );
};
