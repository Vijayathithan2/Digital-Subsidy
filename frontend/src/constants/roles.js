export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  BENEFICIARY: 'ROLE_BENEFICIARY',
  FIELD_OFFICER: 'ROLE_FIELD_OFFICER',
  DISTRICT_OFFICER: 'ROLE_DISTRICT_OFFICER',
  FINANCE_OFFICER: 'ROLE_FINANCE_OFFICER',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'System Administrator',
  [ROLES.BENEFICIARY]: 'Subsidy Beneficiary',
  [ROLES.FIELD_OFFICER]: 'Field Inspection Officer',
  [ROLES.DISTRICT_OFFICER]: 'District Review Officer',
  [ROLES.FINANCE_OFFICER]: 'Finance & Disbursement Officer',
};

export const DEMO_ACCOUNTS = [
  {
    role: ROLES.ADMIN,
    username: 'admin',
    password: 'Admin@123',
    label: 'Admin (Rajesh Sharma)',
    department: 'Department of Expenditure & Subsidies',
  },
  {
    role: ROLES.FIELD_OFFICER,
    username: 'field_officer1',
    password: 'Officer@123',
    label: 'Field Officer (Amit Kumar)',
    department: 'Pune District Field Verification Wing',
  },
  {
    role: ROLES.DISTRICT_OFFICER,
    username: 'district_officer1',
    password: 'District@123',
    label: 'District Magistrate (Dr. Neha Verma)',
    department: 'District Collectorate Office',
  },
  {
    role: ROLES.FINANCE_OFFICER,
    username: 'finance_officer1',
    password: 'Finance@123',
    label: 'Finance Officer (Sanjay Gupta)',
    department: 'State Treasury & DBT Cell',
  },
  {
    role: ROLES.BENEFICIARY,
    username: 'farmer_john',
    password: 'User@123',
    label: 'Beneficiary: Farmer (John Doe)',
    department: 'Applicant / Agriculture Scheme',
  },
  {
    role: ROLES.BENEFICIARY,
    username: 'artisan_priya',
    password: 'User@123',
    label: 'Beneficiary: Artisan (Priya Patel)',
    department: 'Applicant / Handicraft & Green Solar',
  }
];

export const hasRole = (userRoles = [], requiredRole) => {
  if (!userRoles) return false;
  if (Array.isArray(userRoles)) {
    return userRoles.includes(requiredRole);
  }
  return false;
};

export const isOfficerRole = (userRoles = []) => {
  return (
    hasRole(userRoles, ROLES.FIELD_OFFICER) ||
    hasRole(userRoles, ROLES.DISTRICT_OFFICER) ||
    hasRole(userRoles, ROLES.FINANCE_OFFICER) ||
    hasRole(userRoles, ROLES.ADMIN)
  );
};
