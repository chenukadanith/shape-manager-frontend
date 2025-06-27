// src/auth/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) { // <--- UNCOMMENT THIS BLOCK
    // You can render a loading spinner here while checking auth status
    return <div>Checking authentication status...</div>; // Or your loading spinner component
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;