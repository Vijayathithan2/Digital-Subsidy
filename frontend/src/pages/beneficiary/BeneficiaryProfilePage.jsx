import React, { useState, useEffect } from 'react';
import { beneficiaryService } from '../../services/beneficiaryService';
import { regionService } from '../../services/regionService';
import { useToast } from '../../context/ToastContext';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import { KycBadge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { UserCheck, Building, Landmark, ShieldCheck, Check } from 'lucide-react';

export const BeneficiaryProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    identityNumber: '',
    regionId: '',
    category: 'GENERAL',
    dateOfBirth: '1990-01-01',
    annualIncome: '120000',
    landHoldingHectares: '0.00',
    disabled: false,
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: '',
    addressLine: '',
  });

  const { success, error } = useToast();

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [profileData, regionsData] = await Promise.allSettled([
        beneficiaryService.getMyProfile(),
        regionService.getAllRegions(),
      ]);

      if (regionsData.status === 'fulfilled') {
        setRegions(regionsData.value || []);
        if (regionsData.value?.length > 0) {
          setFormData((prev) => ({ ...prev, regionId: regionsData.value[0].id }));
        }
      }

      if (profileData.status === 'fulfilled' && profileData.value) {
        setProfile(profileData.value);
        setFormData({
          identityNumber: profileData.value.identityNumber || '',
          regionId: profileData.value.regionId || '',
          category: profileData.value.category || 'GENERAL',
          dateOfBirth: profileData.value.dateOfBirth || '1990-01-01',
          annualIncome: profileData.value.annualIncome || '120000',
          landHoldingHectares: profileData.value.landHoldingHectares || '0.00',
          disabled: !!profileData.value.disabled,
          bankAccountNumber: profileData.value.bankAccountNumber || '',
          bankIfscCode: profileData.value.bankIfscCode || '',
          bankName: profileData.value.bankName || '',
          addressLine: profileData.value.addressLine || '',
        });
      }
    } catch (err) {
      console.warn('Profile not yet created or error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const saved = await beneficiaryService.registerProfile({
        ...formData,
        regionId: Number(formData.regionId),
        annualIncome: Number(formData.annualIncome),
        landHoldingHectares: Number(formData.landHoldingHectares || 0),
      });
      setProfile(saved);
      success('Beneficiary profile registered and updated successfully!');
    } catch (err) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Beneficiary Profile</h2>
        <LoadingSkeleton rows={5} height={60} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            Beneficiary Master Profile
          </h2>
          {profile && <KycBadge status={profile.kycStatus} />}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Manage your verified Aadhaar identity, economic category, and Direct Benefit Transfer bank details
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Column: Summary Card */}
        <div>
          <Card title="Identification Summary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Full Name:</span>
                <div style={{ fontWeight: 700 }}>{profile?.fullName || 'Not registered'}</div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Aadhaar Identity:</span>
                <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                  {profile?.identityNumber || 'Pending entry'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Category / Quota:</span>
                <div>
                  <span className="badge badge-submitted">{profile?.category || 'GENERAL'}</span>
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Region Jurisdiction:</span>
                <div style={{ fontWeight: 600 }}>
                  {profile?.regionName ? `${profile.regionName}, ${profile.stateName}` : 'Not assigned'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Registered Address:</span>
                <div style={{ fontSize: '12px', color: 'var(--gov-slate-700)' }}>
                  {profile?.addressLine || 'None'}
                </div>
              </div>
            </div>
          </Card>

          <Card title="DBT Bank Account Verification" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Bank Name:</span>
                <div style={{ fontWeight: 700 }}>{profile?.bankName || 'Pending'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Account Number:</span>
                <div style={{ fontWeight: 600 }}>{profile?.bankAccountNumber || 'Pending'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>IFSC Code:</span>
                <div style={{ fontWeight: 600 }}>{profile?.bankIfscCode || 'Pending'}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Edit / Register Form */}
        <Card title={profile ? 'Update Beneficiary Profile' : 'Register Beneficiary Profile'}>
          <form onSubmit={handleSubmit}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">
                  Aadhaar / National Identity Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="identityNumber"
                  className="form-input"
                  placeholder="e.g. AADHAAR-1234-5678-9012"
                  value={formData.identityNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Jurisdiction Region <span className="required">*</span>
                </label>
                <select
                  name="regionId"
                  className="form-select"
                  value={formData.regionId}
                  onChange={handleChange}
                  required
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.districtName}, {r.stateName} ({r.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">
                  Beneficiary Category <span className="required">*</span>
                </label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="GENERAL">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="EWS">Economically Weaker Section (EWS)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Date of Birth <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-input"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Annual Household Income (INR) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="annualIncome"
                  className="form-input"
                  placeholder="150000"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Land Holding (Hectares)</label>
                <input
                  type="number"
                  step="0.01"
                  name="landHoldingHectares"
                  className="form-input"
                  placeholder="e.g. 1.50"
                  value={formData.landHoldingHectares}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="disabled"
                    checked={formData.disabled}
                    onChange={handleChange}
                  />
                  <span>Applicant has certified disability status (Divyangjan)</span>
                </label>
              </div>
            </div>

            <div style={{ margin: '16px 0 12px 0', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '14px' }}>
                Direct Benefit Transfer (DBT) Bank Account Metadata
              </h4>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">
                  Bank Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  className="form-input"
                  placeholder="e.g. State Bank of India"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Bank Account Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  className="form-input"
                  placeholder="309811223344"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Bank IFSC Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="bankIfscCode"
                  className="form-input"
                  placeholder="SBIN0001234"
                  value={formData.bankIfscCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Complete Residential Address <span className="required">*</span>
              </label>
              <textarea
                name="addressLine"
                rows="2"
                className="form-textarea"
                placeholder="Village / Ward, Taluka, District, State"
                value={formData.addressLine}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="submit" variant="primary" loading={submitting} icon={ShieldCheck}>
                Save & Verify Beneficiary Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
