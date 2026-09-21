import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrencyINR } from '../../utils/formatters';
import { Search, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const OtrLookupModal = ({ isOpen, onClose }) => {
  const [identityNumber, setIdentityNumber] = useState('');
  const [annualIncome, setAnnualIncome] = useState('150000');
  const [landHolding, setLandHolding] = useState('1.5');
  const [category, setCategory] = useState('OBC');
  const [evaluated, setEvaluated] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  const handleEvaluate = (e) => {
    e.preventDefault();

    // Compute mock score out of 100
    let score = 0;
    const income = Number(annualIncome) || 0;
    const land = Number(landHolding) || 0;

    if (income <= 300000) score += 35;
    else if (income <= 500000) score += 20;

    if (land <= 2.5) score += 35;
    else if (land <= 5.0) score += 15;

    if (['OBC', 'SC', 'ST', 'EWS'].includes(category)) score += 30;

    setCalculatedScore(score);
    setEvaluated(true);
  };

  const matchingSchemes = [
    {
      code: 'SCH-AGRI-01',
      title: 'Pradhan Mantri Krishi Vikas Subsidy',
      minScore: 60,
      grantRange: '₹20,000 - ₹1,500,00',
      status: calculatedScore >= 60 ? 'QUALIFIED' : 'SCORE TOO LOW',
    },
    {
      code: 'SCH-SOLAR-02',
      title: 'National Rural Solar & Green Energy Grant',
      minScore: 50,
      grantRange: '₹50,000 - ₹2,500,00',
      status: calculatedScore >= 50 ? 'QUALIFIED' : 'SCORE TOO LOW',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="One-Time Registration (OTR) & Scheme Eligibility Calculator" size="lg">
      <div
        style={{
          backgroundColor: 'var(--gov-slate-50)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '12px',
          color: 'var(--gov-navy-900)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Sparkles size={18} color="#ee4b6c" />
        <span>
          Enter your economic and landholding parameters below to calculate your instant eligibility score across central DBT welfare schemes.
        </span>
      </div>

      <form onSubmit={handleEvaluate} style={{ marginBottom: '24px' }}>
        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Aadhaar / OTR Identity Ref</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. AADHAAR-8839-2091-1123"
              value={identityNumber}
              onChange={(e) => setIdentityNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Social Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="GENERAL">General</option>
              <option value="OBC">OBC (Other Backward Classes)</option>
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="ST">ST (Scheduled Tribe)</option>
              <option value="EWS">EWS (Economically Weaker Section)</option>
            </select>
          </div>
        </div>

        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Annual Family Income (INR)</label>
            <input
              type="number"
              className="form-input"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Agricultural Land Holding (Hectares)</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={landHolding}
              onChange={(e) => setLandHolding(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button type="submit" variant="primary" icon={Sparkles} style={{ backgroundColor: '#ee4b6c', borderColor: '#ee4b6c' }}>
            Calculate Instant Eligibility Score
          </Button>
        </div>
      </form>

      {evaluated && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #ee4b6c',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Calculated OTR Eligibility Matrix Score:
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#ee4b6c' }}>
                {calculatedScore} / 100 Points
              </div>
            </div>

            <div
              style={{
                backgroundColor: calculatedScore >= 60 ? '#ecfdf5' : '#fff1f2',
                color: calculatedScore >= 60 ? '#047857' : '#be123c',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              {calculatedScore >= 60 ? 'HIGH ELIGIBILITY RATING' : 'MODERATE ELIGIBILITY RATING'}
            </div>
          </div>

          <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--gov-navy-950)', marginBottom: '10px' }}>
            Matching Welfare & Grant Schemes:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {matchingSchemes.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  backgroundColor: 'var(--gov-slate-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gov-navy-900)' }}>
                    {s.title} ({s.code})
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Min Score: {s.minScore} pts • Grant Slabs: {s.grantRange}
                  </div>
                </div>

                {s.status === 'QUALIFIED' ? (
                  <span className="badge badge-completed">ELIGIBLE TO APPLY</span>
                ) : (
                  <span className="badge badge-rejected">BELOW SCORE</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};
