import React, { useState, useEffect } from 'react';
import { schemeService } from '../../services/schemeService';
import { useToast } from '../../context/ToastContext';
import { formatCurrencyINR } from '../../utils/formatters';
import { DataTable } from '../../components/tables/DataTable';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Plus, Edit2, Sliders, Trash2, CheckCircle2 } from 'lucide-react';

export const SchemeManagementPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scheme Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    department: '',
    totalBudget: '',
    minGrantAmount: '',
    maxGrantAmount: '',
    minEligibilityScore: 60,
    active: true,
    criteria: [
      {
        criterionType: 'ANNUAL_INCOME',
        comparisonOperator: 'LESS_THAN_OR_EQUAL',
        expectedValue: '300000',
        weightPoints: 50,
        mandatory: true,
        description: 'Annual family income limit',
      },
    ],
  });

  const { success, error } = useToast();

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await schemeService.getAllSchemes();
      setSchemes(data || []);
    } catch (err) {
      error(err.message || 'Failed to load schemes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, []);

  const openCreateModal = () => {
    setEditingScheme(null);
    setFormData({
      code: `SCH-PROG-${Math.floor(10 + Math.random() * 90)}`,
      title: '',
      description: '',
      department: 'Department of Welfare & Rural Development',
      totalBudget: '50000000',
      minGrantAmount: '25000',
      maxGrantAmount: '150000',
      minEligibilityScore: 60,
      active: true,
      criteria: [
        {
          criterionType: 'ANNUAL_INCOME',
          comparisonOperator: 'LESS_THAN_OR_EQUAL',
          expectedValue: '300000',
          weightPoints: 50,
          mandatory: true,
          description: 'Annual family income limit',
        },
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (scheme) => {
    setEditingScheme(scheme);
    setFormData({
      code: scheme.code,
      title: scheme.title,
      description: scheme.description || '',
      department: scheme.department,
      totalBudget: scheme.totalBudget,
      minGrantAmount: scheme.minGrantAmount,
      maxGrantAmount: scheme.maxGrantAmount,
      minEligibilityScore: scheme.minEligibilityScore,
      active: scheme.active,
      criteria: scheme.criteria && scheme.criteria.length > 0 ? scheme.criteria : [],
    });
    setModalOpen(true);
  };

  const handleAddCriterion = () => {
    setFormData((prev) => ({
      ...prev,
      criteria: [
        ...prev.criteria,
        {
          criterionType: 'AGE',
          comparisonOperator: 'GREATER_THAN_OR_EQUAL',
          expectedValue: '18',
          weightPoints: 25,
          mandatory: false,
          description: 'Minimum applicant age requirement',
        },
      ],
    }));
  };

  const handleRemoveCriterion = (index) => {
    setFormData((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index),
    }));
  };

  const handleCriterionChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.criteria];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, criteria: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        totalBudget: Number(formData.totalBudget),
        minGrantAmount: Number(formData.minGrantAmount),
        maxGrantAmount: Number(formData.maxGrantAmount),
        minEligibilityScore: Number(formData.minEligibilityScore),
        criteria: formData.criteria.map((c) => ({
          ...c,
          weightPoints: Number(c.weightPoints),
        })),
      };

      if (editingScheme) {
        await schemeService.updateScheme(editingScheme.id, payload);
        success('Scheme updated successfully!');
      } else {
        await schemeService.createScheme(payload);
        success('New subsidy scheme created with eligibility rules!');
      }

      setModalOpen(false);
      loadSchemes();
    } catch (err) {
      error(err.message || 'Failed to save scheme.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'code',
      title: 'Scheme Code',
      sortable: true,
      render: (val) => <strong>{val}</strong>,
    },
    {
      key: 'title',
      title: 'Scheme Title & Department',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--gov-navy-950)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.department}</div>
        </div>
      ),
    },
    {
      key: 'totalBudget',
      title: 'Total Budget',
      sortable: true,
      render: (val) => formatCurrencyINR(val),
    },
    {
      key: 'remainingBudget',
      title: 'Remaining Budget',
      sortable: true,
      render: (val) => (
        <span style={{ fontWeight: 700, color: 'var(--gov-emerald-700)' }}>{formatCurrencyINR(val)}</span>
      ),
    },
    {
      key: 'minGrantAmount',
      title: 'Grant Slabs',
      render: (val, row) => `${formatCurrencyINR(val)} - ${formatCurrencyINR(row.maxGrantAmount)}`,
    },
    {
      key: 'minEligibilityScore',
      title: 'Min Score',
      render: (val) => `${val} pts`,
    },
    {
      key: 'active',
      title: 'Status',
      render: (val) => (
        <span className={`badge ${val ? 'badge-completed' : 'badge-draft'}`}>
          {val ? 'ACTIVE' : 'INACTIVE'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <Button variant="secondary" size="sm" icon={Edit2} onClick={() => openEditModal(row)}>
          Edit
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Scheme Master Management</h2>
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
            <Sliders size={22} color="#1e3a8a" />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
              Scheme Master & Criteria Rules Configuration
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Configure subsidy program parameters, grant slabs, and algorithmic eligibility scoring criteria.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          Create New Welfare Scheme
        </Button>
      </div>

      <div className="gov-card">
        <DataTable
          columns={columns}
          data={schemes}
          searchableKey="title"
          searchPlaceholder="Search scheme title or code..."
          pageSize={8}
        />
      </div>

      {/* Scheme Create / Edit Modal */}
      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title={editingScheme ? `Edit Scheme: ${editingScheme.code}` : 'Create New Welfare Subsidy Scheme'}
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Scheme Code <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Managing Department <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Scheme Official Title <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Pradhan Mantri Krishi Vikas Subsidy"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Program Description</label>
              <textarea
                rows="2"
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Total Sanctioned Budget <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Min Grant Amount <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.minGrantAmount}
                  onChange={(e) => setFormData({ ...formData, minGrantAmount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Grant Amount <span className="required">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.maxGrantAmount}
                  onChange={(e) => setFormData({ ...formData, maxGrantAmount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Min Qualifying Eligibility Score (pts)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.minEligibilityScore}
                  onChange={(e) => setFormData({ ...formData, minEligibilityScore: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  <span>Scheme Active & Open for Beneficiary Applications</span>
                </label>
              </div>
            </div>

            {/* Criteria Builder */}
            <div style={{ margin: '20px 0 10px 0', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-950)' }}>
                  Eligibility Evaluation Rules Engine
                </h4>
                <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={handleAddCriterion}>
                  Add Rule Criterion
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {formData.criteria.map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      backgroundColor: 'var(--gov-slate-50)',
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr auto auto',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <select
                      className="form-select"
                      style={{ fontSize: '12px' }}
                      value={c.criterionType}
                      onChange={(e) => handleCriterionChange(idx, 'criterionType', e.target.value)}
                    >
                      <option value="ANNUAL_INCOME">Annual Income</option>
                      <option value="BENEFICIARY_CATEGORY">Category</option>
                      <option value="AGE">Age</option>
                      <option value="LAND_HOLDING">Land Holding</option>
                      <option value="DISABILITY_STATUS">Disability Status</option>
                      <option value="REGION_CODE">Region Code</option>
                    </select>

                    <select
                      className="form-select"
                      style={{ fontSize: '12px' }}
                      value={c.comparisonOperator}
                      onChange={(e) => handleCriterionChange(idx, 'comparisonOperator', e.target.value)}
                    >
                      <option value="LESS_THAN_OR_EQUAL">&lt;= Less Than or Equal</option>
                      <option value="GREATER_THAN_OR_EQUAL">&gt;= Greater Than or Equal</option>
                      <option value="EQUALS">== Equals</option>
                      <option value="NOT_EQUALS">!= Not Equals</option>
                      <option value="IN">IN (Comma separated)</option>
                      <option value="CONTAINS">Contains</option>
                    </select>

                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '12px' }}
                      placeholder="Expected Value"
                      value={c.expectedValue}
                      onChange={(e) => handleCriterionChange(idx, 'expectedValue', e.target.value)}
                      required
                    />

                    <input
                      type="number"
                      className="form-input"
                      style={{ fontSize: '12px' }}
                      placeholder="Points"
                      value={c.weightPoints}
                      onChange={(e) => handleCriterionChange(idx, 'weightPoints', e.target.value)}
                      required
                    />

                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={c.mandatory}
                        onChange={(e) => handleCriterionChange(idx, 'mandatory', e.target.checked)}
                      />
                      <span>Mandatory</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveCriterion(idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--gov-crimson-600)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Save Subsidy Scheme
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
