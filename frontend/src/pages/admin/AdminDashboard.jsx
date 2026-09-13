import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { formatCurrencyINR, formatPercentage } from '../../utils/formatters';
import { Card } from '../../components/common/Card';
import { DonutChart } from '../../components/charts/DonutChart';
import { BarChart } from '../../components/charts/BarChart';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Layers,
  Users,
  FileText,
  CreditCard,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const data = await analyticsService.getDashboardAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          Executive Subsidy & Disbursement Analytics
        </h2>
        <LoadingSkeleton rows={5} height={90} />
      </div>
    );
  }

  // Prepare chart data
  const categoryData = Object.entries(analytics.categoryDistribution || {}).map(([key, count], i) => {
    const colors = ['#1e3a8a', '#059669', '#d97706', '#7c3aed', '#dc2626'];
    return {
      label: key,
      value: count,
      color: colors[i % colors.length],
    };
  });

  const barChartData = (analytics.schemeBreakdown || []).map((s) => ({
    label: s.schemeCode,
    value1: Number(s.totalBudget) || 0,
    value2: Number(s.releasedFunds) || 0,
  }));

  return (
    <div>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fff1f4 100%)',
          color: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          border: '1px solid #fecdd3',
          boxShadow: '0 2px 8px rgba(238, 75, 108, 0.08)',
        }}
      >
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827' }}>
            National Subsidy & DBT Executive Command Center
          </h2>
          <p style={{ fontSize: '13.5px', color: '#4b5563' }}>
            Real-time multi-jurisdiction monitoring of public financial grants, disbursements & compliance audits.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#ea580c', fontWeight: 800, letterSpacing: '0.04em' }}>
              OVERALL DBT UTILIZATION
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#ee4b6c' }}>
              {formatPercentage(analytics.overallUtilizationPercentage)}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Subsidies</span>
            <span className="stat-value">{analytics.totalSchemes}</span>
            <span className="stat-subtext">{analytics.activeSchemes} Active Programs</span>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gov-navy-50)', color: 'var(--gov-navy-700)' }}>
            <Layers size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Registered Beneficiaries</span>
            <span className="stat-value">{analytics.totalBeneficiaries}</span>
            <span className="stat-subtext">Aadhaar identity verified</span>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gov-emerald-50)', color: 'var(--gov-emerald-700)' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Applications</span>
            <span className="stat-value">{analytics.totalApplications}</span>
            <span className="stat-subtext">
              {analytics.approvedApplications} Approved | {analytics.rejectedApplications} Rejected
            </span>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <FileText size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Overdue Milestones</span>
            <span className="stat-value" style={{ color: analytics.overdueMilestonesCount > 0 ? 'var(--gov-crimson-600)' : 'inherit' }}>
              {analytics.overdueMilestonesCount}
            </span>
            <span className="stat-subtext">Pending compliance trigger</span>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'var(--gov-crimson-50)', color: 'var(--gov-crimson-600)' }}>
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Financial Health Row */}
      <div className="grid-cols-3" style={{ marginBottom: '24px' }}>
        <Card title="Approved Sanctioned Funds">
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--gov-navy-950)' }}>
            {formatCurrencyINR(analytics.totalApprovedFunds)}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Total sanctioned grants approved by Finance Officers across regions.
          </p>
        </Card>

        <Card title="Treasury Released (DBT)">
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--gov-emerald-700)' }}>
            {formatCurrencyINR(analytics.totalReleasedFunds)}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Funds transferred into beneficiary bank accounts via RBI/PFMS gateways.
          </p>
        </Card>

        <Card title="Certified Ground Utilization">
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0284c7' }}>
            {formatCurrencyINR(analytics.totalUtilizedFunds)}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Expenditure verified with physical ground proofs and purchase receipts.
          </p>
        </Card>
      </div>

      {/* Visual Analytics Row: Bar Chart & Donut Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', marginBottom: '24px' }}>
        <Card title="Scheme Budget Allocation vs Treasury Releases">
          {barChartData.length > 0 ? (
            <BarChart items={barChartData} height={200} />
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No scheme data available.
            </div>
          )}
        </Card>

        <Card title="Beneficiary Category Distribution">
          {categoryData.length > 0 ? (
            <DonutChart
              data={categoryData}
              centerLabel={String(analytics.totalBeneficiaries)}
              centerSub="Beneficiaries"
            />
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No category data available.
            </div>
          )}
        </Card>
      </div>

      {/* Regional Jurisdictions Performance Breakdown Table */}
      <Card title="Regional Jurisdiction Budget Performance">
        <div className="table-wrapper">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Region Code</th>
                <th>District / State</th>
                <th>Allocated Budget</th>
                <th>Approved Funds</th>
                <th>Released Funds</th>
                <th>Applications</th>
                <th>Utilization Rate</th>
              </tr>
            </thead>
            <tbody>
              {(analytics.regionBreakdown || []).map((r) => (
                <tr key={r.regionId}>
                  <td style={{ fontWeight: 700 }}>{r.regionCode}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.districtName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.stateName}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatCurrencyINR(r.allocatedBudget)}</td>
                  <td>{formatCurrencyINR(r.approvedFunds)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--gov-emerald-700)' }}>
                    {formatCurrencyINR(r.releasedFunds)}
                  </td>
                  <td><strong>{r.totalApplications}</strong></td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--gov-navy-800)' }}>
                      {formatPercentage(r.budgetUtilizationRate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
