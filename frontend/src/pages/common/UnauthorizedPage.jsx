import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const UnauthorizedPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--gov-crimson-100)',
          color: 'var(--gov-crimson-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <ShieldAlert size={36} />
      </div>

      <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--gov-navy-950)', marginBottom: '8px' }}>
        403 - Access Authorization Denied
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '460px', marginBottom: '24px' }}>
        You do not possess the required Government Role credentials to access this protected operational module.
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Link to="/login">
          <Button variant="secondary" icon={ArrowLeft}>
            Switch User Account
          </Button>
        </Link>
        <Link to="/">
          <Button variant="primary">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
};
