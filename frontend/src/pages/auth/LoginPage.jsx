import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, DEMO_ACCOUNTS } from '../../constants/roles';
import { Shield, Lock, User, LogIn, Sparkles, Landmark } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  const { login, quickSwitchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show session expired banner when redirected by the API interceptor
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setSessionExpired(true);
    }
  }, [location.search]);

  const handlePostLoginRedirect = (roles = []) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }

    if (roles.includes(ROLES.ADMIN)) {
      navigate('/admin/dashboard', { replace: true });
    } else if (
      roles.includes(ROLES.FIELD_OFFICER) ||
      roles.includes(ROLES.DISTRICT_OFFICER) ||
      roles.includes(ROLES.FINANCE_OFFICER)
    ) {
      navigate('/officer/dashboard', { replace: true });
    } else {
      navigate('/beneficiary/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!username.trim() || !password.trim()) {
      setFormError('Please enter both username and password.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(username.trim(), password);
      handlePostLoginRedirect(data.roles);
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (account) => {
    setUsername(account.username);
    setPassword(account.password);
    setSubmitting(true);
    setFormError('');
    try {
      const data = await quickSwitchRole(account);
      handlePostLoginRedirect(data.roles);
    } catch (err) {
      setFormError(err.message || 'Quick login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 100px)',
        backgroundColor: '#ffffff',
        padding: '36px 32px',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      {/* Session Expired Banner */}
      {sessionExpired && (
        <div
          style={{
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            color: '#c2410c',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ⚠️ Your session has expired. Please sign in again.
        </div>
      )}

      {/* Prominent NSP Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '36px',
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-0.035em',
            margin: 0,
          }}
        >
          Portal Application Login
        </h1>
        <div style={{ width: '56px', height: '4px', backgroundColor: '#ee4b6c', marginTop: '6px', borderRadius: '2px' }} />
      </div>

      {/* Main 2-Column Portal Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1fr)',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Form & Login Tabs */}
        <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: '36px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                fontWeight: 800,
                color: '#1f2937',
                margin: 0,
              }}
            >
              Application Login
            </h2>
            <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              New user?{' '}
              <Link to="/register" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>
                Register yourself
              </Link>
            </div>
          </div>

          {/* Sub-tabs matching NSP style */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              borderBottom: '2px solid #e5e7eb',
              marginBottom: '24px',
              paddingBottom: '8px',
            }}
          >
            <span
              style={{
                color: '#ee4b6c',
                fontWeight: 700,
                fontSize: '14px',
                borderBottom: '3px solid #ee4b6c',
                paddingBottom: '8px',
                marginBottom: '-11px',
                cursor: 'pointer',
              }}
            >
              Login with Credentials
            </span>
            <span
              style={{
                color: '#6b7280',
                fontWeight: 500,
                fontSize: '14px',
                paddingBottom: '8px',
                cursor: 'pointer',
              }}
            >
              Login with OTR
            </span>
          </div>

          {formError && (
            <div
              style={{
                backgroundColor: '#fff1f2',
                border: '1px solid #ffe4e6',
                color: '#be123c',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                marginBottom: '20px',
                fontWeight: 600,
              }}
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', color: '#374151' }}>
                Username / Official Identifier <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{
                    paddingLeft: '38px',
                  }}
                  placeholder="Enter your Username / Aadhaar / ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={submitting}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', color: '#374151' }}>
                Password <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }}
                />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: '#374151',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '10px 28px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <LogIn size={16} /> Sign In
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px dashed #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-heading)',
                fontSize: '13px',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '12px',
              }}
            >
              <Sparkles size={15} color="#ea580c" />
              <span>1-Click Instant Demo Login:</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  disabled={submitting}
                  style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 'var(--radius-md)',
                    padding: '9px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff1f4';
                    e.currentTarget.style.borderColor = '#ee4b6c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#111827',
                    }}
                  >
                    {acc.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {acc.username}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Portal Instructions & Guidelines */}
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 800,
              color: '#1f2937',
              margin: 0,
              marginBottom: '12px',
            }}
          >
            Portal Login Tips
          </h2>
          <div style={{ width: '40px', height: '3px', backgroundColor: '#ee4b6c', marginBottom: '20px' }} />

          <ol
            style={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              fontSize: '13.5px',
              lineHeight: 1.6,
              color: '#374151',
            }}
          >
            <li>
              <strong>Applicant / Beneficiary:</strong> Must read scheme eligibility guidelines carefully before submitting grant applications.
            </li>
            <li>
              <strong>Document Verification:</strong> Ensure all uploaded certificates and identity proofs are legible and up-to-date.
            </li>
            <li>
              <strong>Valid Credentials:</strong> Use your registered username and password to log in. Any false information may lead to rejection.
            </li>
            <li>
              <strong>One-Time Registration (OTR):</strong> Keep your unique OTR identifier safe to track direct benefit disbursements.
            </li>
            <li>
              <strong>Security Protocol:</strong> Keep your login credentials confidential and refrain from sharing passkeys with unverified agents.
            </li>
            <li>
              <strong>Role Switcher:</strong> Use the 1-Click quick role switcher above to test Field Officer, District Officer, Finance, and Beneficiary views instantly.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
