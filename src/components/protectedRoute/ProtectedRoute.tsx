import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const isAuthenticated = () => {
  // Adjust this logic to your actual authentication method
  return (
    !!localStorage.getItem('token') || !!document.cookie.match(/access_token/)
  );
};

const ProtectedRoute = () => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
