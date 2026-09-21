import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { MOCK_GUIDELINES } from '../../data/mockData';
import { FileText, Download, ShieldCheck, Calendar, Building, Eye } from 'lucide-react';
import { Button } from '../common/Button';

export const GuidelinesModal = ({ isOpen, onClose }) => {
  const [selectedGuide, setSelectedGuide] = useState(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Government Guidelines & Policy Gazette" size="lg">
      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '12px',
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <ShieldCheck size={20} />
        <span>
          Official Direct Benefit Transfer (DBT) Mission Circulars, Ministry Gazette Notifications, and Standard Operating Procedures (SOPs).
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {MOCK_GUIDELINES.map((guide) => (
          <div
            key={guide.id}
            className="gov-card"
            style={{
              marginBottom: 0,
              backgroundColor: '#ffffff',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <span className="badge badge-submitted" style={{ marginBottom: '6px' }}>
                    {guide.category} • {guide.version}
                  </span>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gov-navy-950)', margin: 0 }}>
                    {guide.title}
                  </h4>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Updated: {guide.updatedDate}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building size={14} color="#ee4b6c" /> {guide.issuingAuthority}
                </span>
              </div>

              <p style={{ fontSize: '12.5px', color: 'var(--gov-slate-700)', lineHeight: 1.5, marginBottom: '14px' }}>
                {guide.summary}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '12px',
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>File Size: {guide.fileSize} (PDF Gazette)</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Eye}
                  onClick={() => setSelectedGuide(guide)}
                >
                  View Summary
                </Button>
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(guide.title + '\n\n' + guide.summary)}`}
                  download={`${guide.title.replace(/ /g, '_')}.txt`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="primary" size="sm" icon={Download} style={{ backgroundColor: '#ee4b6c', borderColor: '#ee4b6c' }}>
                    Download Circular
                  </Button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Guide Details Modal Popup */}
      {selectedGuide && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedGuide(null)}
          title={`Gazette Summary: ${selectedGuide.title}`}
          size="md"
        >
          <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--gov-slate-800)' }}>
            <div style={{ marginBottom: '12px' }}>
              <strong>Issuing Authority:</strong> {selectedGuide.issuingAuthority}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Category & Version:</strong> {selectedGuide.category} ({selectedGuide.version})
            </div>
            <div
              style={{
                backgroundColor: 'var(--gov-slate-50)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                marginBottom: '16px',
              }}
            >
              {selectedGuide.summary}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setSelectedGuide(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
};
