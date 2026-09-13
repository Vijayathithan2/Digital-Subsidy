import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Common Pages
import { UnauthorizedPage } from '../pages/common/UnauthorizedPage';
import { NotFoundPage } from '../pages/common/NotFoundPage';

// Beneficiary Pages
import { BeneficiaryDashboard } from '../pages/beneficiary/BeneficiaryDashboard';
import { SchemeCatalogPage } from '../pages/beneficiary/SchemeCatalogPage';
import { MyApplicationsPage } from '../pages/beneficiary/MyApplicationsPage';
import { ApplicationTrackingPage } from '../pages/beneficiary/ApplicationTrackingPage';
import { BeneficiaryProfilePage } from '../pages/beneficiary/BeneficiaryProfilePage';

// Officer Pages
import { OfficerDashboard } from '../pages/officer/OfficerDashboard';
import { FieldVerificationPage } from '../pages/officer/FieldVerificationPage';
import { DistrictReviewPage } from '../pages/officer/DistrictReviewPage';
import { FinanceApprovalPage } from '../pages/officer/FinanceApprovalPage';
import { DisbursementManagementPage } from '../pages/officer/DisbursementManagementPage';
import { MilestoneInspectionPage } from '../pages/officer/MilestoneInspectionPage';
import { UtilizationMonitoringPage } from '../pages/officer/UtilizationMonitoringPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { SchemeManagementPage } from '../pages/admin/SchemeManagementPage';
import { RegionManagementPage } from '../pages/admin/RegionManagementPage';
import { BeneficiaryDirectoryPage } from '../pages/admin/BeneficiaryDirectoryPage';
import { ReportsPage } from '../pages/admin/ReportsPage';
import { AuditTrailPage } from '../pages/admin/AuditTrailPage';
import { IntegrationsPage } from '../pages/admin/IntegrationsPage';

const RootRedirect = () => {
  const { isAuthenticated, roles } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles.includes(ROLES.ADMIN)) return <Navigate to="/admin/dashboard" replace />;
  if (
    roles.includes(ROLES.FIELD_OFFICER) ||
    roles.includes(ROLES.DISTRICT_OFFICER) ||
    roles.includes(ROLES.FINANCE_OFFICER)
  ) {
    return <Navigate to="/officer/dashboard" replace />;
  }
  return <Navigate to="/beneficiary/dashboard" replace />;
};

export const AppRoutes = () => {
  const allOfficersAndAdmin = [
    ROLES.FIELD_OFFICER,
    ROLES.DISTRICT_OFFICER,
    ROLES.FINANCE_OFFICER,
    ROLES.ADMIN,
  ];

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected App Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RootRedirect />} />

        {/* Beneficiary Module */}
        <Route
          path="beneficiary/dashboard"
          element={
            <ProtectedRoute requiredRoles={[ROLES.BENEFICIARY, ROLES.ADMIN]}>
              <BeneficiaryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="beneficiary/schemes"
          element={
            <ProtectedRoute>
              <SchemeCatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="beneficiary/schemes/:id"
          element={
            <ProtectedRoute>
              <SchemeCatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="beneficiary/applications"
          element={
            <ProtectedRoute requiredRoles={[ROLES.BENEFICIARY, ROLES.ADMIN]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="beneficiary/applications/:id"
          element={
            <ProtectedRoute>
              <ApplicationTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="beneficiary/profile"
          element={
            <ProtectedRoute requiredRoles={[ROLES.BENEFICIARY, ROLES.ADMIN]}>
              <BeneficiaryProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Officer Module */}
        <Route
          path="officer/dashboard"
          element={
            <ProtectedRoute requiredRoles={allOfficersAndAdmin}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/field-verification"
          element={
            <ProtectedRoute requiredRoles={[ROLES.FIELD_OFFICER, ROLES.ADMIN]}>
              <FieldVerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/district-review"
          element={
            <ProtectedRoute requiredRoles={[ROLES.DISTRICT_OFFICER, ROLES.ADMIN]}>
              <DistrictReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/finance-approval"
          element={
            <ProtectedRoute requiredRoles={[ROLES.FINANCE_OFFICER, ROLES.ADMIN]}>
              <FinanceApprovalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/disbursements"
          element={
            <ProtectedRoute requiredRoles={[ROLES.FINANCE_OFFICER, ROLES.ADMIN]}>
              <DisbursementManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/milestones"
          element={
            <ProtectedRoute requiredRoles={allOfficersAndAdmin}>
              <MilestoneInspectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/utilizations"
          element={
            <ProtectedRoute requiredRoles={allOfficersAndAdmin}>
              <UtilizationMonitoringPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Module */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/schemes"
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <SchemeManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/regions"
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <RegionManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/beneficiaries"
          element={
            <ProtectedRoute requiredRoles={allOfficersAndAdmin}>
              <BeneficiaryDirectoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.FINANCE_OFFICER, ROLES.DISTRICT_OFFICER]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/audit"
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AuditTrailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/integrations"
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.FINANCE_OFFICER]}>
              <IntegrationsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
