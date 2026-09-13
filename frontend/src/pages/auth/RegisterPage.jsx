import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { UserPlus, ArrowLeft, Landmark } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'ROLE_BENEFICIARY',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);

  const { success } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setErrorDetails([]);

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        roles: [formData.role],
      });
      success('Beneficiary account registered successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
      if (err.details && Array.isArray(err.details)) {
        setErrorDetails(err.details);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {/* Minimalist Header */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            padding: '28px 32px 20px',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/login"
              style={{
                color: 'var(--gov-slate-600)',
                display: 'flex',
                alignItems: 'center',
                padding: '6px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
              }}
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                New Beneficiary Registration
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Register your credentials to apply for Central & State Subsidies
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '28px 32px 32px' }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: 'var(--gov-crimson-50)',
                border: '1px solid var(--gov-crimson-100)',
                color: 'var(--gov-crimson-700)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              <div>{errorMsg}</div>
              {errorDetails.length > 0 && (
                <ul style={{ marginTop: '6px', paddingLeft: '18px', fontSize: '12px' }}>
                  {errorDetails.map((det, i) => (
                    <li key={i}>{det}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-cols-2" style={{ gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  Username <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="e.g. rahul_kumar"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Full Name (As per Aadhaar/Govt ID) <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="e.g. Rahul Kumar Verma"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="grid-cols-2" style={{ gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="ROLE_BENEFICIARY">Beneficiary / Applicant</option>
                <option value="ROLE_FIELD_OFFICER">Field Verification Officer</option>
                <option value="ROLE_DISTRICT_OFFICER">District Magistrate / Reviewer</option>
                <option value="ROLE_FINANCE_OFFICER">Finance & DBT Officer</option>
              </select>
              <p className="form-hint">
                Standard citizen applicants should select Beneficiary / Applicant.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ width: '100%', marginTop: '8px' }}
              icon={UserPlus}
            >
              Complete Registration
            </Button>
          </form>

          <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--gov-navy-700)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
