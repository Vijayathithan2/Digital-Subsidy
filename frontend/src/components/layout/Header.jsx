import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, Landmark, Headphones, LogIn, UserPlus, FileCheck, HelpCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { ROLE_LABELS } from '../../constants/roles';
import { Link, useLocation } from 'react-router-dom';

import { HelpdeskModal } from '../modals/HelpdeskModal';
import { GrievanceModal } from '../modals/GrievanceModal';
import { FaqModal } from '../modals/FaqModal';
import { GuidelinesModal } from '../modals/GuidelinesModal';
import { OtrLookupModal } from '../modals/OtrLookupModal';

export const Header = ({ onToggleSidebar }) => {
  const { user, logout, roles, isAuthenticated } = useAuth();
  const location = useLocation();
  const primaryRole = roles[0] || 'ROLE_BENEFICIARY';
  const roleLabel = ROLE_LABELS[primaryRole] || primaryRole;

  const [activeModal, setActiveModal] = useState(null); // 'helpdesk' | 'grievance' | 'faq' | 'guidelines' | 'otr' | null

  const isBeneficiaryOrGuest =
    !isAuthenticated ||
    roles.length === 0 ||
    roles.includes('ROLE_BENEFICIARY') ||
    (!roles.includes('ROLE_ADMIN') &&
     !roles.includes('ROLE_FIELD_OFFICER') &&
     !roles.includes('ROLE_DISTRICT_OFFICER') &&
     !roles.includes('ROLE_FINANCE_OFFICER'));

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
          <div
            onClick={() => setActiveModal('helpdesk')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: 'var(--nsp-charcoal)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Open National Helpdesk"
          >
            <Headphones size={18} color="#ee4b6c" />
            <span>Helpdesk</span>
          </div>

          {isAuthenticated && user ? (
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

      {/* Signature NSP Coral Pink Ribbon Bar - Only visible to Beneficiaries & Public Guests */}
      {isBeneficiaryOrGuest ? (
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
        {!isAuthenticated ? (
          // Unauthenticated: show auth links
          <>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                backgroundColor: location.pathname === '/login' || location.pathname === '/' ? '#be123c' : 'transparent',
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
                backgroundColor: location.pathname === '/register' ? '#be123c' : 'transparent',
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
          </>
        ) : null}

        <button
          onClick={() => setActiveModal('otr')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <FileCheck size={15} /> Know your OTR / Scheme
        </button>

        <button
          onClick={() => setActiveModal('faq')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            opacity: 0.95,
          }}
        >
          <HelpCircle size={15} /> FAQ's
        </button>

        <button
          onClick={() => setActiveModal('grievance')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            opacity: 0.95,
          }}
        >
          <MessageSquare size={15} /> Grievance
        </button>

        <button
          onClick={() => setActiveModal('guidelines')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            opacity: 0.95,
          }}
        >
          <ShieldCheck size={15} /> Guidelines
        </button>
      </div>
      ) : null}

      {/* Render Active Modals */}
      <HelpdeskModal isOpen={activeModal === 'helpdesk'} onClose={() => setActiveModal(null)} />
      <GrievanceModal isOpen={activeModal === 'grievance'} onClose={() => setActiveModal(null)} />
      <FaqModal isOpen={activeModal === 'faq'} onClose={() => setActiveModal(null)} />
      <GuidelinesModal isOpen={activeModal === 'guidelines'} onClose={() => setActiveModal(null)} />
      <OtrLookupModal isOpen={activeModal === 'otr'} onClose={() => setActiveModal(null)} />
    </header>
  );
};
