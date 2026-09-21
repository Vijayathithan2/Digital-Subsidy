import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { MOCK_FAQS } from '../../data/mockData';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openId, setOpenId] = useState('faq-1');

  const categories = ['All', 'DBT & Bank Transfer', 'Identity & e-KYC', 'Eligibility & Scoring', 'Grievances & Appeals'];

  const filteredFaqs = MOCK_FAQS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Frequently Asked Questions (FAQ)" size="lg">
      {/* Search & Category Filter */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search FAQ questions, DBT rules, or eligibility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid var(--border)',
                backgroundColor: selectedCategory === cat ? '#ee4b6c' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : 'var(--gov-navy-900)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredFaqs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No matching FAQ articles found for "{searchTerm}".
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpenItem = openId === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                }}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isOpenItem ? 'var(--gov-slate-50)' : '#ffffff',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    color: 'var(--gov-navy-950)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HelpCircle size={16} color="#ee4b6c" />
                    <span>{faq.question}</span>
                  </div>
                  {isOpenItem ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isOpenItem && (
                  <div
                    style={{
                      padding: '14px 16px',
                      borderTop: '1px solid var(--border-light)',
                      fontSize: '13px',
                      color: 'var(--gov-slate-700)',
                      lineHeight: 1.6,
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div style={{ fontSize: '10.5px', color: '#ee4b6c', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                      Category: {faq.category}
                    </div>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};
