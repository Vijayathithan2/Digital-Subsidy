import React, { useState, useEffect } from 'react';
import { beneficiaryService } from '../../services/beneficiaryService';
import { useToast } from '../../context/ToastContext';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import { KycBadge } from '../../components/common/Badge';
import { DataTable } from '../../components/tables/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Users, UserCheck, ShieldCheck } from 'lucide-react';

export const BeneficiaryDirectoryPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // KYC Modal
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [kycStatus, setKycStatus] = useState('VERIFIED');
  const [submittingKyc, setSubmittingKyc] = useState(false);

  const { success, error } = useToast();

  const loadBeneficiaries = async () => {
    setLoading(true);
    try {
      const data = await beneficiaryService.getAll();
      setBeneficiaries(data || []);
    } catch (err) {
      error(err.message || 'Failed to fetch beneficiaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const handleUpdateKyc = async (e) => {
    e.preventDefault();
    setSubmittingKyc(true);
    try {
      await beneficiaryService.updateKycStatus(selectedBeneficiary.id, kycStatus);
      success(`KYC status updated to ${kycStatus} for ${selectedBeneficiary.fullName}!`);
      setSelectedBeneficiary(null);
      loadBeneficiaries();
    } catch (err) {
      error(err.message || 'Failed to update KYC status.');
    } finally {
      setSubmittingKyc(false);
    }
  };

  const columns = [
    {
      key: 'identityNumber',
      title: 'Aadhaar / National ID',
      sortable: true,
      render: (val) => <span style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{val}</span>,
    },
    {
      key: 'fullName',
      title: 'Beneficiary Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.email || row.phone}</div>
        </div>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      render: (val) => <span className="badge badge-submitted">{val}</span>,
    },
    {
      key: 'regionName',
      title: 'Jurisdiction',
      render: (val, row) => `${val || '-'}, ${row.stateName || ''}`,
    },
    {
      key: 'annualIncome',
      title: 'Annual Income',
      sortable: true,
      render: (val) => formatCurrencyINR(val),
    },
    {
      key: 'bankAccountNumber',
      title: 'DBT Bank Account',
      render: (val, row) => (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.bankName} ({row.bankIfscCode})</div>
        </div>
      ),
    },
    {
      key: 'kycStatus',
      title: 'KYC Status',
      render: (val) => <KycBadge status={val} />,
    },
    {
      key: 'actions',
      title: 'Action',
      render: (_, row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setSelectedBeneficiary(row);
            setKycStatus(row.kycStatus || 'VERIFIED');
          }}
        >
          Update KYC
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Beneficiary Master Directory</h2>
        <LoadingSkeleton rows={5} height={60} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={22} color="#1e3a8a" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            Beneficiary Master Registry & KYC Management
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Manage citizen identity verification, economic classifications, and direct bank disbursement metadata.
        </p>
      </div>

      <div className="gov-card">
        <DataTable
          columns={columns}
          data={beneficiaries}
          searchableKey="fullName"
          searchPlaceholder="Search by beneficiary name or ID..."
          pageSize={10}
        />
      </div>

      {selectedBeneficiary && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBeneficiary(null)}
          title={`Update KYC: ${selectedBeneficiary.fullName}`}
        >
          <form onSubmit={handleUpdateKyc}>
            <div
              style={{
                backgroundColor: 'var(--gov-slate-50)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                fontSize: '12px',
              }}
            >
              <div>Aadhaar: <strong>{selectedBeneficiary.identityNumber}</strong></div>
              <div>Current Status: <strong>{selectedBeneficiary.kycStatus}</strong></div>
            </div>

            <div className="form-group">
              <label className="form-label">KYC Verification Status <span className="required">*</span></label>
              <select
                className="form-select"
                value={kycStatus}
                onChange={(e) => setKycStatus(e.target.value)}
              >
                <option value="VERIFIED">VERIFIED (Identity confirmed against National Registry)</option>
                <option value="PENDING">PENDING (Awaiting inspection)</option>
                <option value="REJECTED">REJECTED (Discrepancy in Aadhaar or Bank IFSC)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <Button type="button" variant="secondary" onClick={() => setSelectedBeneficiary(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submittingKyc}>
                Update KYC Status
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
