import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import appRoutes from '../constants/appRoutes';
import roles from '../constants/roles';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import CalendarPage from '../pages/calendar/CalendarPage';
import RequestListPage from '../pages/requests/RequestListPage';
import RequestDetailPage from '../pages/requests/RequestDetailPage';
import RequestFormPage from '../pages/requests/RequestFormPage';
import VehiclesPage from '../pages/vehicles/VehiclePage';
import StaffPage from '../pages/staff/StaffPage';
import ReportsPage from '../pages/reports/ReportsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import NotFoundPage from '../pages/notfound/NotFoundPage';

const AppRoutes = () => (
  <Routes>
    <Route path={appRoutes.login} element={<LoginPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardPage />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="requests" element={<RequestListPage />} />
      <Route path="requests/new" element={<RequestFormPage />} />
      <Route path="requests/:id" element={<RequestDetailPage />} />
      <Route
        path="vehicles"
        element={
          <RoleRoute allowedRoles={[roles.ADMIN, roles.OPERATOR]}>
            <VehiclesPage />
          </RoleRoute>
        }
      />
      <Route
        path="staff"
        element={
          <RoleRoute allowedRoles={[roles.ADMIN]}>
            <StaffPage />
          </RoleRoute>
        }
      />
      <Route
        path="reports"
        element={
          <RoleRoute allowedRoles={[roles.ADMIN, roles.DIRECTOR]}>
            <ReportsPage />
          </RoleRoute>
        }
      />
      <Route
        path="settings"
        element={
          <RoleRoute allowedRoles={[roles.ADMIN]}>
            <SettingsPage />
          </RoleRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
    <Route path={appRoutes.notFound} element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
