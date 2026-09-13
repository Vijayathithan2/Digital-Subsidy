# Government Subsidy & Grant Disbursement Tracking System — React Frontend

An enterprise-grade, accessible React frontend engineered for the Government Subsidy & Grant Disbursement Tracking System, built with **React**, **Vite**, **React Router v6**, **Axios**, and **Lucide React**.

---

## 1. Quick Start Guide

### Prerequisites
- Node.js 18+ or 20+ (tested on Node v24.15.0)
- npm 9+ or 11+
- Spring Boot backend running on `http://localhost:8080`

### Installation & Execution
```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (already pre-installed)
npm install

# Run the local development server (runs on port 3000)
npm run dev

# Build for production distribution
npm run build
```

The application runs by default at:
```
http://localhost:3000/
```

---

## 2. Environment Configuration

The environment file `.env` is pre-configured with the default Spring Boot port:
```ini
VITE_API_BASE_URL=http://localhost:8080
```
If your backend server runs on a different port or host, update `VITE_API_BASE_URL` in `.env`.

---

## 3. Pre-Configured Seed Demo Accounts

The top Government Header provides a **1-Click Quick Demo Role Switcher** to instantly switch between all government roles, or you can log in on the Login Page with:

| Role | Username | Password | Full Name | Primary Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `Admin@123` | Rajesh Sharma | Scheme master, criteria rules, regional budgets, audit logs, analytics |
| **Field Officer** | `field_officer1` | `Officer@123` | Amit Kumar | Physical inspection, ground verification, document verification |
| **District Officer** | `district_officer1` | `District@123` | Dr. Neha Verma | District scrutiny, administrative endorsement, overdue milestone monitoring |
| **Finance Officer** | `finance_officer1` | `Finance@123` | Sanjay Gupta | Financial sanctions, staged milestone plans, Treasury DBT fund releases |
| **Beneficiary 1** | `farmer_john` | `User@123` | John Doe | Browse schemes, apply for subsidies, track 11-step workflow, submit utilizations |
| **Beneficiary 2** | `artisan_priya` | `User@123` | Priya Patel | Apply for rural solar & artisan schemes, track disbursements |

---

## 4. End-to-End Application Workflow State Machine

The frontend dynamically visualizes and executes the complete 11-stage lifecycle matching the backend state machine:
$$\text{DRAFT} \longrightarrow \text{SUBMITTED} \longrightarrow \text{ELIGIBILITY\_EVALUATED} \longrightarrow \text{FIELD\_VERIFICATION} \longrightarrow \text{DISTRICT\_REVIEW} \longrightarrow \text{FINANCE\_APPROVAL} \longrightarrow \text{DISBURSEMENT\_PLANNED} \longrightarrow \text{MILESTONE\_PENDING} \longrightarrow \text{DISBURSEMENT\_IN\_PROGRESS} \longrightarrow \text{FULLY\_DISBURSED} \longrightarrow \text{UTILIZATION\_PENDING} \longrightarrow \text{COMPLETED}$$

---

## 5. API Integrations Map

| Module | HTTP Method & Path | Backend Controller | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST /api/auth/login` | `AuthController` | JWT Bearer authentication |
| **Auth** | `POST /api/auth/register` | `AuthController` | New user/beneficiary registration |
| **Auth** | `GET /api/auth/me` | `AuthController` | Authenticated user profile |
| **Schemes** | `GET /api/schemes` | `SchemeController` | Public & authenticated scheme list |
| **Schemes** | `GET /api/schemes/active` | `SchemeController` | Active welfare programs |
| **Schemes** | `POST /api/schemes` | `SchemeController` | Admin scheme creation with criteria |
| **Schemes** | `PUT /api/schemes/{id}` | `SchemeController` | Update scheme budget and criteria |
| **Beneficiaries** | `GET /api/beneficiaries/me` | `BeneficiaryController` | Logged-in beneficiary profile |
| **Beneficiaries** | `POST /api/beneficiaries` | `BeneficiaryController` | Register identity & bank DBT details |
| **Beneficiaries** | `GET /api/beneficiaries` | `BeneficiaryController` | Beneficiary master directory |
| **Beneficiaries** | `PATCH /api/beneficiaries/{id}/kyc` | `BeneficiaryController` | KYC certification update |
| **Applications** | `POST /api/applications` | `ApplicationController` | Create draft application |
| **Applications** | `POST /api/applications/{id}/submit`| `ApplicationController` | Formally submit application |
| **Applications** | `POST /api/applications/{id}/documents` | `ApplicationController` | Attach verification documents |
| **Applications** | `POST /api/applications/{id}/evaluate-eligibility` | `ApplicationController` | Automated eligibility scoring |
| **Applications** | `GET /api/applications/my` | `ApplicationController` | Beneficiary application history |
| **Applications** | `GET /api/applications` | `ApplicationController` | Officer multi-status query |
| **Applications** | `GET /api/applications/{id}` | `ApplicationController` | Full application detail view |
| **Verifications** | `POST /api/verifications/field/{id}` | `VerificationController` | Ground field inspection |
| **Verifications** | `POST /api/verifications/district/{id}` | `VerificationController` | District magistrate review |
| **Verifications** | `POST /api/verifications/finance/{id}` | `VerificationController` | Finance sanction & grant earmarking |
| **Verifications** | `GET /api/verifications/application/{id}` | `VerificationController` | Verification stage audit history |
| **Disbursements** | `POST /api/disbursements/plan` | `DisbursementController` | Formulate staged milestone schedule |
| **Disbursements** | `GET /api/disbursements/application/{id}` | `DisbursementController` | Application disbursement plan |
| **Disbursements** | `POST /api/disbursements/milestones/{id}/release` | `DisbursementController` | Treasury DBT release with UTR |
| **Milestones** | `POST /api/milestones/{id}/complete` | `MilestoneController` | Mark compliance condition satisfied |
| **Milestones** | `GET /api/milestones/overdue` | `MilestoneController` | Overdue milestone monitor |
| **Utilizations** | `POST /api/utilizations/application/{id}` | `UtilizationController` | Submit ground expenditure invoices |
| **Utilizations** | `GET /api/utilizations/application/{id}` | `UtilizationController` | Application utilization list |
| **Utilizations** | `POST /api/utilizations/{id}/verify` | `UtilizationController` | Certify expenditure; advances to `COMPLETED` |
| **Analytics** | `GET /api/analytics/dashboard` | `AnalyticsController` | Executive KPI analytics |
| **Reports** | `GET /api/reports/.../csv` | `ReportController` | CSV export for Schemes, Regions, Disbursements, Milestones, Utilizations |
| **Audit Logs** | `GET /api/audit-logs` | `AuditController` | Immutable audit trail |
| **Integrations** | `POST /api/integrations/treasury/test-transfer` | `IntegrationController` | Treasury DBT transfer simulator |
| **Integrations** | `GET /api/integrations/beneficiary/verify-identity` | `IntegrationController` | National Identity verification simulator |
