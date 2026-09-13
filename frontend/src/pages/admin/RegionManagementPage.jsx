import React, { useState, useEffect } from 'react';
import { regionService } from '../../services/regionService';
import { useToast } from '../../context/ToastContext';
import { formatCurrencyINR } from '../../utils/formatters';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Map, Plus } from 'lucide-react';

export const RegionManagementPage = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    stateName: '',
    districtName: '',
    subDistrict: '',
    allocatedBudget: '50000000',
  });

  const { success, error } = useToast();

  const loadRegions = async () => {
    setLoading(true);
    try {
      const data = await regionService.getAllRegions();
      setRegions(data || []);
    } catch (err) {
      error(err.message || 'Failed to fetch regional jurisdictions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegions();
  }, []);

  const handleCreateRegion = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await regionService.createRegion({
        ...formData,
        allocatedBudget: Number(formData.allocatedBudget),
      });
      success(`Region ${formData.code} created successfully!`);
      setModalOpen(false);
      setFormData({
        code: '',
        stateName: '',
        districtName: '',
        subDistrict: '',
        allocatedBudget: '50000000',
      });
      loadRegions();
    } catch (err) {
      error(err.message || 'Failed to create region.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'code',
      title: 'Region Code',
      sortable: true,
      render: (val) => <strong>{val}</strong>,
    },
    {
      key: 'districtName',
      title: 'District & Sub-District',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.subDistrict || '-'}</div>
        </div>
      ),
    },
    {
      key: 'stateName',
      title: 'State',
      sortable: true,
      render: (val) => val,
    },
    {
      key: 'allocatedBudget',
      title: 'Allocated Budget',
      sortable: true,
      render: (val) => <span style={{ fontWeight: 600 }}>{formatCurrencyINR(val)}</span>,
    },
    {
      key: 'utilizedBudget',
      title: 'Disbursed / Utilized',
      sortable: true,
      render: (val) => (
        <span style={{ fontWeight: 700, color: 'var(--gov-emerald-700)' }}>{formatCurrencyINR(val)}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          Regional Jurisdictions Management
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Map size={22} color="#1e3a8a" />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
              Regional Jurisdictions & District Budgets
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Manage administrative districts, regional codes, and allocated DBT subsidy expenditure limits.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
          Add New Jurisdiction Region
        </Button>
      </div>

      <div className="gov-card">
        <DataTable
          columns={columns}
          data={regions}
          searchableKey="districtName"
          searchPlaceholder="Search district or state..."
          pageSize={10}
        />
      </div>

      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title="Create New Regional Jurisdiction"
        >
          <form onSubmit={handleCreateRegion}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Region Code <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. REG-GJ-01"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">State Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Gujarat"
                  value={formData.stateName}
                  onChange={(e) => setFormData({ ...formData, stateName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">District Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ahmedabad"
                  value={formData.districtName}
                  onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sub-District / Taluka</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Daskroi"
                  value={formData.subDistrict}
                  onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Allocated Budget (INR) <span className="required">*</span></label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="50000000"
                value={formData.allocatedBudget}
                onChange={(e) => setFormData({ ...formData, allocatedBudget: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Save Jurisdiction
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
