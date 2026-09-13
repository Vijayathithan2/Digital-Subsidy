import React, { useState } from 'react';
import { integrationService } from '../../services/integrationService';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Cpu, CheckCircle2, ShieldCheck, Send, Search } from 'lucide-react';

export const IntegrationsPage = () => {
  // Treasury Form
  const [treasuryData, setTreasuryData] = useState({
    accountNumber: '309811223344',
    ifsc: 'SBIN0001234',
    amount: '50000',
    schemeCode: 'SCH-AGRI-01',
  });
  const [treasuryResult, setTreasuryResult] = useState(null);
  const [treasuryLoading, setTreasuryLoading] = useState(false);

  // Identity Form
  const [identityNumber, setIdentityNumber] = useState('AADHAAR-8839-2091-1123');
  const [identityResult, setIdentityResult] = useState(null);
  const [identityLoading, setIdentityLoading] = useState(false);

  const { success, error } = useToast();

  const handleTreasurySubmit = async (e) => {
    e.preventDefault();
    setTreasuryLoading(true);
    setTreasuryResult(null);
    try {
      const res = await integrationService.testTreasuryTransfer({
        ...treasuryData,
        amount: Number(treasuryData.amount),
      });
      setTreasuryResult(res);
      success('Treasury transfer simulated successfully!');
    } catch (err) {
      error(err.message || 'Treasury simulation failed.');
    } finally {
      setTreasuryLoading(false);
    }
  };

  const handleIdentitySubmit = async (e) => {
    e.preventDefault();
    setIdentityLoading(true);
    setIdentityResult(null);
    try {
      const res = await integrationService.verifyIdentity(identityNumber);
      setIdentityResult(res);
      success('Identity verification check returned successfully!');
    } catch (err) {
      error(err.message || 'Identity check failed.');
    } finally {
      setIdentityLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={22} color="#1e3a8a" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            Treasury Gateway & National Identity Registry Integrations
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Test Direct Benefit Transfer (DBT) payment gateway simulations and National Identity (Aadhaar) registry verifications.
        </p>
      </div>

      <div className="grid-cols-2" style={{ gap: '24px' }}>
        {/* Treasury DBT Simulator */}
        <Card title="Treasury DBT Gateway Simulation">
          <form onSubmit={handleTreasurySubmit}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Beneficiary Account Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={treasuryData.accountNumber}
                  onChange={(e) => setTreasuryData({ ...treasuryData, accountNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bank IFSC Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={treasuryData.ifsc}
                  onChange={(e) => setTreasuryData({ ...treasuryData, ifsc: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Transfer Amount (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={treasuryData.amount}
                  onChange={(e) => setTreasuryData({ ...treasuryData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Scheme Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={treasuryData.schemeCode}
                  onChange={(e) => setTreasuryData({ ...treasuryData, schemeCode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <Button type="submit" variant="primary" loading={treasuryLoading} icon={Send}>
                Execute Test DBT Transfer
              </Button>
            </div>
          </form>

          {treasuryResult && (
            <div
              style={{
                marginTop: '20px',
                backgroundColor: 'var(--gov-slate-50)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gov-emerald-700)', fontWeight: 700, marginBottom: '8px' }}>
                <CheckCircle2 size={16} /> DBT Gateway Response:
              </div>
              <pre style={{ margin: 0, overflowX: 'auto', color: 'var(--gov-slate-800)' }}>
                {JSON.stringify(treasuryResult, null, 2)}
              </pre>
            </div>
          )}
        </Card>

        {/* National Identity Simulator */}
        <Card title="National Identity Registry Check">
          <form onSubmit={handleIdentitySubmit}>
            <div className="form-group">
              <label className="form-label">Citizen Identity (Aadhaar Number)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AADHAAR-8839-2091-1123"
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                required
              />
              <span className="form-hint">
                Verifies identity against simulated National Citizen Registry database.
              </span>
            </div>

            <div style={{ marginTop: '20px' }}>
              <Button type="submit" variant="secondary" loading={identityLoading} icon={Search}>
                Verify National Identity
              </Button>
            </div>
          </form>

          {identityResult && (
            <div
              style={{
                marginTop: '20px',
                backgroundColor: 'var(--gov-slate-50)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gov-navy-800)', fontWeight: 700, marginBottom: '8px' }}>
                <ShieldCheck size={16} /> Registry Verification Record:
              </div>
              <pre style={{ margin: 0, overflowX: 'auto', color: 'var(--gov-slate-800)' }}>
                {JSON.stringify(identityResult, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
