import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, Landmark, Headphones, LogIn, UserPlus, FileCheck, HelpCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { ROLE_LABELS } from '../../constants/roles';
import { Link, useLocation } from 'react-router-dom';

export const Header = ({ onToggleSidebar }) => {
  const { user, logout, roles } = useAuth();
  const location = useLocation();
  const primaryRole = roles[0] || 'ROLE_BENEFICIARY';
  const roleLabel = ROLE_LABELS[primaryRole] || primaryRole;

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onToggleSidebar}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--nsp-charcoal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--surface-subtle)',
              transition: 'all 0.15s ease',
            }}
            title="Toggle Navigation Menu"
          >
            <Menu size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #ee4b6c, #be123c)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(238, 75, 108, 0.3)',
              }}
            >
              <Landmark size={22} />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#111827',
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                National Subsidy & Grant Portal
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, margin: 0, marginTop: '2px' }}>
                Government Direct Benefit Transfer Mission
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--nsp-charcoal)', fontWeight: 600 }}>
            <Headphones size={18} color="#ee4b6c" />
            <span>Helpdesk</span>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {user.fullName || user.username}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    fontSize: '10.5px',
                    color: '#ee4b6c',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {roleLabel}
                </div>
              </div>

              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--nsp-pink-50)',
                  color: 'var(--nsp-pink-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: '1px solid var(--nsp-pink-light)',
                }}
              >
                {user.username ? user.username.substring(0, 2).toUpperCase() : 'GOV'}
              </div>

              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                style={{
                  color: 'var(--gov-crimson-600)',
                  borderColor: 'var(--border)',
                  padding: '6px 12px',
                  fontSize: '12px',
                }}
                title="Sign out from system"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" style={{ backgroundColor: 'var(--nsp-pink-main)', borderColor: 'var(--nsp-pink-main)' }}>
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Signature NSP Coral Pink Ribbon Bar */}
      <div
        style={{
          backgroundColor: '#ee4b6c',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflowX: 'auto',
        }}
      >
        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            backgroundColor: location.pathname === '/login' || location.pathname === '/' ? '#374151' : 'transparent',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            textDecoration: 'none',
            transition: 'background-color 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <LogIn size={15} /> Login
        </Link>

        <Link
          to="/register"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            backgroundColor: location.pathname === '/register' ? '#374151' : 'transparent',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            textDecoration: 'none',
            transition: 'background-color 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <UserPlus size={15} /> Register
        </Link>

        <Link
          to={user ? "/beneficiary/schemes" : "/login"}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            backgroundColor: location.pathname.includes('/schemes') ? '#374151' : 'transparent',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            textDecoration: 'none',
            transition: 'background-color 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <FileCheck size={15} /> Know your OTR / Scheme
        </Link>

        <a
          href="#faq"
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            opacity: 0.95,
          }}
        >
          <HelpCircle size={15} /> FAQ's
        </a>

        <a
          href="#grievance"
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            opacity: 0.95,
          }}
        >
          <MessageSquare size={15} /> Grievance
        </a>

        <a
          href="#guidelines"
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            opacity: 0.95,
          }}
        >
          <ShieldCheck size={15} /> Guidelines
        </a>
      </div>
    </header>
  );
};

