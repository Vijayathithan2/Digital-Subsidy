import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Headphones, PhoneCall, Mail, MessageSquare, Clock, Send, Bot, User } from 'lucide-react';

export const HelpdeskModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to the National Subsidy & DBT Helpdesk Virtual Assistant. How may I help you today?',
    },
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'How do I track my DBT payment?',
    'What is required for e-KYC verification?',
    'How to link Aadhaar with Bank account?',
    'How do I lodge a formal grievance?',
  ];

  const handleSend = (textToSend = null) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');

    // Simulate Bot Response
    setTimeout(() => {
      let botResponse = 'Thank you for contacting the National Subsidy Helpdesk. ';
      const lower = text.toLowerCase();

      if (lower.includes('track') || lower.includes('payment') || lower.includes('dbt')) {
        botResponse += 'You can track your real-time DBT milestone payments by clicking "My Applications" in your beneficiary dashboard or by entering your Application Ref into the tracking bar.';
      } else if (lower.includes('kyc') || lower.includes('aadhaar')) {
        botResponse += 'e-KYC requires your 12-digit Aadhaar number and active mobile phone for OTP verification. Ensure your bank account has active NPCI DBT mapping.';
      } else if (lower.includes('grievance') || lower.includes('complaint')) {
        botResponse += 'You can lodge a formal grievance with SLA tracking by clicking the "Grievance" tab on the top header navigation.';
      } else {
        botResponse += 'For complex application inquiries, our Nodal Officers are available toll-free at 1800-11-0001 (Mon–Sat, 9:00 AM – 6:00 PM).';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="National DBT Helpdesk & Support Center" size="lg">
      <div className="grid-cols-2" style={{ gap: '20px', marginBottom: '20px' }}>
        {/* Helplines Box */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gov-navy-950)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={18} color="#ee4b6c" />
            Toll-Free Government Helplines
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              National DBT Mission Helpline
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#ee4b6c' }}>
              1800-11-0001 / 14447
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              PFMS Treasury Integration Support
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
              1800-11-8111
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
            <Clock size={14} />
            <span>Support Hours: Mon – Sat (9:00 AM to 6:00 PM IST)</span>
          </div>
        </div>

        {/* Support Email Box */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gov-navy-950)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} color="#ee4b6c" />
            Official Portal Nodal Support
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Beneficiary Help Email
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
              helpdesk-dbt@gov.in
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Grievance Appeals Division
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
              appeals-subsidy@gov.in
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)', marginTop: '8px' }}>
            Department of Direct Benefit Transfer, Cabinet Secretariat, Government of India.
          </div>
        </div>
      </div>

      {/* Live Assistant Simulation */}
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: '#ee4b6c',
            color: '#ffffff',
            padding: '10px 16px',
            fontWeight: 700,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Bot size={16} />
          <span>Interactive DBT Assistant</span>
        </div>

        <div
          style={{
            height: '200px',
            overflowY: 'auto',
            padding: '14px',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '9px 14px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  lineHeight: 1.4,
                  backgroundColor: m.sender === 'user' ? '#ee4b6c' : 'var(--gov-slate-100)',
                  color: m.sender === 'user' ? '#ffffff' : 'var(--gov-navy-950)',
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: 'var(--gov-slate-50)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
          }}
        >
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: 'var(--gov-navy-800)',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', padding: '10px', backgroundColor: '#ffffff', borderTop: '1px solid var(--border)', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button variant="primary" onClick={() => handleSend()} icon={Send} style={{ backgroundColor: '#ee4b6c', borderColor: '#ee4b6c' }}>
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};
