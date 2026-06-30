import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import appRoutes from '../constants/appRoutes';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to={appRoutes.login} replace />;
  }

  return children;
};

export default ProtectedRoute;
