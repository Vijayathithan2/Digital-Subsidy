import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const NotFoundPage = () => {
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
          backgroundColor: 'var(--gov-slate-100)',
          color: 'var(--gov-slate-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <AlertCircle size={36} />
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gov-navy-950)', marginBottom: '8px' }}>
        404 - Resource Not Found
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '440px', marginBottom: '24px' }}>
        The government page, application reference, or subsidy report you requested does not exist.
      </p>

      <Link to="/">
        <Button variant="primary">Return to Portal Home</Button>
      </Link>
    </div>
  );
};
