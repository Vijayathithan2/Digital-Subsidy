import React, { useState, useEffect } from 'react';
import { grievanceService } from '../../services/grievanceService';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { ShieldAlert, CheckCircle, RefreshCw, Eye, MessageSquare, Edit } from 'lucide-react';

export const GrievanceManagementPage = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  // Resolution Modal State
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [status, setStatus] = useState('IN_PROGRESS');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const { success, error } = useToast();

  const loadGrievances = async () => {
    setLoading(true);
    try {
      const data = await grievanceService.getAllGrievances();
      setGrievances(data || []);
    } catch (err) {
      console.error('Failed to load grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievances();
  }, []);

  const openResolveModal = (g) => {
    setSelectedGrievance(g);
    setStatus(g.status || 'IN_PROGRESS');
    setAssignedOfficer(g.assignedOfficer || 'District Nodal Officer');
    setOfficerRemarks(g.officerRemarks || '');
  };

  const handleUpdateGrievance = async (e) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    setUpdating(true);
    try {
      await grievanceService.updateGrievanceStatus(selectedGrievance.id, {
        status,
        assignedOfficer,
        officerRemarks,
      });

      success(`Grievance ${selectedGrievance.trackingNumber} updated successfully!`);
      setSelectedGrievance(null);
      loadGrievances();
    } catch (err) {
      error(err.message || 'Failed to update grievance.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
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

  const columns = [
    {
      key: 'trackingNumber',
      title: 'Tracking Ref',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 800, color: '#ee4b6c' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'applicantName',
      title: 'Complainant / Beneficiary',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.applicantEmail || row.applicantPhone}</div>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      render: (val) => <span className="badge badge-submitted">{val}</span>,
    },
    {
      key: 'subject',
      title: 'Grievance Subject',
      render: (val, row) => (
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--gov-navy-900)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Ref App: {row.applicationRef || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      key: 'assignedOfficer',
      title: 'Assigned Officer',
      render: (val) => <span style={{ fontSize: '12px', fontWeight: 600 }}>{val || 'Unassigned'}</span>,
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (val) => getStatusBadge(val),
    },
    {
      key: 'actions',
      title: 'Action',
      render: (_, row) => (
        <Button variant="secondary" size="sm" icon={Edit} onClick={() => openResolveModal(row)}>
          Investigate & Respond
        </Button>
      ),
    },
  ];

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
            Public Grievance Redressal & Appeals Dashboard
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Nodal investigation tracking, SLA compliance, and formal response dispatch
          </p>
        </div>

        <Button variant="secondary" icon={RefreshCw} onClick={loadGrievances}>
          Refresh Queue
        </Button>
      </div>

      <div className="gov-card">
        <DataTable
          columns={columns}
          data={grievances}
          searchableKey="trackingNumber"
          searchPlaceholder="Search by Tracking Ref, Complainant, or Category..."
          pageSize={10}
        />
      </div>

      {/* Resolution & Investigation Modal */}
      {selectedGrievance && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedGrievance(null)}
          title={`Investigate Grievance ${selectedGrievance.trackingNumber}`}
          size="lg"
        >
          <form onSubmit={handleUpdateGrievance}>
            <div
              style={{
                backgroundColor: 'var(--gov-slate-50)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Complainant Details:
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gov-navy-900)' }}>
                    {selectedGrievance.applicantName} ({selectedGrievance.applicantEmail})
                  </div>
                </div>
                <div>{getStatusBadge(selectedGrievance.status)}</div>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-950)', marginBottom: '4px' }}>
                Subject: {selectedGrievance.subject}
              </div>

              <div style={{ fontSize: '12.5px', color: 'var(--gov-slate-700)', lineHeight: 1.5 }}>
                {selectedGrievance.description}
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Update Grievance Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="SUBMITTED">SUBMITTED (Pending Review)</option>
                  <option value="IN_PROGRESS">IN PROGRESS (Under Investigation)</option>
                  <option value="RESOLVED">RESOLVED (Official Response Sent)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Nodal Officer</label>
                <input
                  type="text"
                  className="form-input"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Official Nodal Remarks & Resolution Notes <span className="required">*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Enter investigation details, treasury re-queue references, or resolution outcome..."
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button type="button" variant="secondary" onClick={() => setSelectedGrievance(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="success" loading={updating} icon={CheckCircle}>
                Save & Update Grievance
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
