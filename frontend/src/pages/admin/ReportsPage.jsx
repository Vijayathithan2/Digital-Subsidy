import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  DownloadCloud,
  FileSpreadsheet,
  Layers,
  Map,
  CreditCard,
  AlertTriangle,
  Receipt,
} from 'lucide-react';

export const ReportsPage = () => {
  const [downloading, setDownloading] = useState(null);
  const { success, error } = useToast();

  const handleDownload = async (key, fetchFn, filename) => {
    setDownloading(key);
    try {
      await fetchFn();
      success(`Report downloaded successfully: ${filename}`);
    } catch (err) {
      error(err.message || 'Failed to download report.');
    } finally {
      setDownloading(null);
    }
  };

  const reports = [
    {
      key: 'schemes',
      title: 'Subsidy Schemes Master Summary',
      description: 'Comprehensive report containing program codes, total budgets, remaining allocations, and grant slabs.',
      filename: 'scheme_summary.csv',
      icon: Layers,
      action: () => reportService.downloadSchemeReport(),
    },
    {
      key: 'regions',
      title: 'Regional Jurisdictions & District Budgets',
      description: 'Summary of budget limits, disbursed subsidies, and expenditure rates organized by state and district.',
      filename: 'region_summary.csv',
      icon: Map,
      action: () => reportService.downloadRegionReport(),
    },
    {
      key: 'disbursements',
      title: 'Direct Benefit Transfer (DBT) Disbursements',
      description: 'Transaction log of milestone releases, Treasury UTR numbers, payment modes, and sanction references.',
      filename: 'disbursements.csv',
      icon: CreditCard,
      action: () => reportService.downloadDisbursementReport(),
    },
    {
      key: 'milestones',
      title: 'Pending & Overdue Compliance Milestones',
      description: 'Audit report of scheduled grant tranches, overdue deadlines, and pending physical compliance inspections.',
      filename: 'overdue_milestones.csv',
      icon: AlertTriangle,
      action: () => reportService.downloadMilestonesReport(),
    },
    {
      key: 'utilizations',
      title: 'Ground Expenditure & Utilization Audit',
      description: 'Detailed report of beneficiary purchase invoices, utilization percentages, and officer verification status.',
      filename: 'utilizations.csv',
      icon: Receipt,
      action: () => reportService.downloadUtilizationReport(),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DownloadCloud size={22} color="#1e3a8a" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            Public Finance Reports & CSV Exports
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Download official audited reports in standard CSV format for treasury submission and inter-departmental analytics.
        </p>
      </div>

      <div className="grid-cols-2" style={{ gap: '20px' }}>
        {reports.map((rpt) => {
          const Icon = rpt.icon;
          const isDownloading = downloading === rpt.key;

          return (
            <div key={rpt.key} className="gov-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 0 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--gov-navy-50)',
                      color: 'var(--gov-navy-800)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                      {rpt.title}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--gov-emerald-700)', fontWeight: 600 }}>
                      Format: CSV (.csv)
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--gov-slate-600)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {rpt.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <Button
                  variant="primary"
                  style={{ width: '100%' }}
                  icon={DownloadCloud}
                  loading={isDownloading}
                  onClick={() => handleDownload(rpt.key, rpt.action, rpt.filename)}
                >
                  Download {rpt.filename}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
