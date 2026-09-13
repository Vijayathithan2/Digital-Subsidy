import { ROLES } from './roles';

export const NAVIGATION_ITEMS = {
  [ROLES.BENEFICIARY]: [
    { label: 'Beneficiary Dashboard', path: '/beneficiary/dashboard', icon: 'LayoutDashboard' },
    { label: 'Available Schemes', path: '/beneficiary/schemes', icon: 'Layers' },
    { label: 'My Applications', path: '/beneficiary/applications', icon: 'FileText' },
    { label: 'Beneficiary Profile', path: '/beneficiary/profile', icon: 'UserCheck' },
  ],
  [ROLES.FIELD_OFFICER]: [
    { label: 'Officer Dashboard', path: '/officer/dashboard', icon: 'LayoutDashboard' },
    { label: 'Field Verification Queue', path: '/officer/field-verification', icon: 'MapPin' },
    { label: 'Milestone Inspections', path: '/officer/milestones', icon: 'CheckSquare' },
    { label: 'Utilization Proofs', path: '/officer/utilizations', icon: 'Receipt' },
  ],
  [ROLES.DISTRICT_OFFICER]: [
    { label: 'District Dashboard', path: '/officer/dashboard', icon: 'LayoutDashboard' },
    { label: 'District Review Queue', path: '/officer/district-review', icon: 'Building' },
    { label: 'Overdue Milestones', path: '/officer/milestones', icon: 'AlertTriangle' },
    { label: 'Regional Reports', path: '/admin/reports', icon: 'DownloadCloud' },
  ],
  [ROLES.FINANCE_OFFICER]: [
    { label: 'Finance Dashboard', path: '/officer/dashboard', icon: 'LayoutDashboard' },
    { label: 'Finance Sanction Queue', path: '/officer/finance-approval', icon: 'CheckCircle' },
    { label: 'Disbursement Plans & DBT', path: '/officer/disbursements', icon: 'CreditCard' },
    { label: 'Expenditure Monitoring', path: '/officer/utilizations', icon: 'PieChart' },
    { label: 'Disbursement Reports', path: '/admin/reports', icon: 'DownloadCloud' },
  ],
  [ROLES.ADMIN]: [
    { label: 'Executive Dashboard', path: '/admin/dashboard', icon: 'Activity' },
    { label: 'Scheme Master', path: '/admin/schemes', icon: 'Sliders' },
    { label: 'Regional Jurisdictions', path: '/admin/regions', icon: 'Map' },
    { label: 'Beneficiary Directory', path: '/admin/beneficiaries', icon: 'Users' },
    { label: 'All Applications', path: '/officer/field-verification', icon: 'FileText' },
    { label: 'CSV Reports', path: '/admin/reports', icon: 'DownloadCloud' },
    { label: 'Audit Trail Logs', path: '/admin/audit', icon: 'ShieldAlert' },
    { label: 'Gateways & Integrations', path: '/admin/integrations', icon: 'Cpu' },
  ],
};
