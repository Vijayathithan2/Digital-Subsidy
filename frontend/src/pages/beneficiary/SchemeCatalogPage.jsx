import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { schemeService } from '../../services/schemeService';
import { regionService } from '../../services/regionService';
import { beneficiaryService } from '../../services/beneficiaryService';
import { applicationService } from '../../services/applicationService';
import { useToast } from '../../context/ToastContext';
import { formatCurrencyINR } from '../../utils/formatters';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Search, Layers, CheckCircle, Info, Send } from 'lucide-react';

export const SchemeCatalogPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Apply Modal state
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [appliedAmount, setAppliedAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [schemesRes, regionsRes, profileRes] = await Promise.allSettled([
          schemeService.getActiveSchemes(),
          regionService.getAllRegions(),
          beneficiaryService.getMyProfile(),
        ]);

        if (schemesRes.status === 'fulfilled') setSchemes(schemesRes.value || []);
        if (regionsRes.status === 'fulfilled') setRegions(regionsRes.value || []);
        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value);
          if (profileRes.value?.regionId) {
            setSelectedRegionId(profileRes.value.regionId);
          }
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openApplyModal = (scheme) => {
    if (!profile) {
      error('Please register your Beneficiary Profile first before applying for grants.');
      navigate('/beneficiary/profile');
      return;
    }
    setSelectedScheme(scheme);
    setAppliedAmount(scheme.minGrantAmount || '');
    if (profile?.regionId) {
      setSelectedRegionId(profile.regionId);
    } else if (regions.length > 0) {
      setSelectedRegionId(regions[0].id);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!appliedAmount || Number(appliedAmount) <= 0) {
      error('Please enter a valid applied grant amount.');
      return;
    }

    if (
      Number(appliedAmount) < Number(selectedScheme.minGrantAmount) ||
      Number(appliedAmount) > Number(selectedScheme.maxGrantAmount)
    ) {
      error(
        `Applied amount must be between ${formatCurrencyINR(selectedScheme.minGrantAmount)} and ${formatCurrencyINR(selectedScheme.maxGrantAmount)}`
      );
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create Draft Application
      const app = await applicationService.createApplication({
        beneficiaryId: profile.id,
        schemeId: selectedScheme.id,
        regionId: Number(selectedRegionId),
        appliedAmount: Number(appliedAmount),
      });

      // 2. Submit Application
      await applicationService.submitApplication(app.id);

      success(`Application ${app.applicationNumber} submitted successfully!`);
      setSelectedScheme(null);
      navigate(`/beneficiary/applications/${app.id}`);
    } catch (err) {
      error(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSchemes = schemes.filter(
    (s) =>
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          Government Subsidy & Welfare Schemes Directory
        </h2>
        <LoadingSkeleton rows={4} height={120} />
      </div>
    );
  }

  return (
    <div>
      {/* Header & Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            National Welfare & Subsidy Schemes
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Explore active central and state financial assistance programs
          </p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gov-slate-400)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search scheme name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid-cols-2" style={{ gap: '20px' }}>
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="gov-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginBottom: 0,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <div>
                  <span className="badge badge-submitted" style={{ marginBottom: '6px' }}>
                    {scheme.code}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                    {scheme.title}
                  </h3>
                </div>
                <span className="badge badge-completed">ACTIVE</span>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--gov-slate-600)', marginBottom: '14px', lineHeight: 1.5 }}>
                {scheme.description || 'Government direct grant assistance program.'}
              </p>

              <div
                style={{
                  backgroundColor: 'var(--gov-slate-50)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  fontSize: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                  <div style={{ fontWeight: 600 }}>{scheme.department}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Min Score:</span>
                  <div style={{ fontWeight: 600, color: 'var(--gov-navy-800)' }}>
                    {scheme.minEligibilityScore} pts
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Grant Range:</span>
                  <div style={{ fontWeight: 700, color: 'var(--gov-emerald-700)' }}>
                    {formatCurrencyINR(scheme.minGrantAmount)} - {formatCurrencyINR(scheme.maxGrantAmount)}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Remaining Budget:</span>
                  <div style={{ fontWeight: 600 }}>{formatCurrencyINR(scheme.remainingBudget)}</div>
                </div>
              </div>

              {/* Criteria Summary */}
              {scheme.criteria && scheme.criteria.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Eligibility Evaluation Rules:
                  </div>
                  <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--gov-slate-700)' }}>
                    {scheme.criteria.map((c, i) => (
                      <li key={i} style={{ marginBottom: '3px' }}>
                        {c.description || `${c.criterionType} ${c.comparisonOperator} ${c.expectedValue}`}{' '}
                        <span style={{ color: 'var(--gov-navy-700)', fontWeight: 600 }}>
                          ({c.weightPoints} pts {c.mandatory ? '• MANDATORY' : ''})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
              <Button
                variant="primary"
                onClick={() => openApplyModal(scheme)}
                style={{ flex: 1 }}
                icon={Send}
              >
                Apply for this Grant
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {selectedScheme && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedScheme(null)}
          title={`Apply for ${selectedScheme.title}`}
          size="lg"
        >
          <form onSubmit={handleApplySubmit}>
            <div
              style={{
                backgroundColor: 'var(--gov-navy-50)',
                border: '1px solid var(--gov-navy-100)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '12px',
                color: 'var(--gov-navy-900)',
              }}
            >
              <strong>Scheme Slabs:</strong> Grant range is {formatCurrencyINR(selectedScheme.minGrantAmount)} to{' '}
              {formatCurrencyINR(selectedScheme.maxGrantAmount)}. Minimum qualifying eligibility score:{' '}
              {selectedScheme.minEligibilityScore} pts.
            </div>

            <div className="form-group">
              <label className="form-label">
                Beneficiary Profile <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                disabled
                value={`${profile?.fullName || ''} (${profile?.identityNumber || ''})`}
              />
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">
                  Jurisdiction Region <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  required
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.districtName}, {r.stateName} ({r.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Requested Grant Amount (INR) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={selectedScheme.minGrantAmount}
                  max={selectedScheme.maxGrantAmount}
                  className="form-input"
                  placeholder="Enter grant amount"
                  value={appliedAmount}
                  onChange={(e) => setAppliedAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--gov-slate-50)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginBottom: '20px',
              }}
            >
              By submitting this subsidy request, your registered economic and identity attributes will be automatically evaluated
              against the scheme's criteria rules.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button type="button" variant="secondary" onClick={() => setSelectedScheme(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="success" loading={submitting} icon={Send}>
                Submit Application
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
