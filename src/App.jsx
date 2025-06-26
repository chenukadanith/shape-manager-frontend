import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext'; // Import AuthProvider
import PrivateRoute from './auth/PrivateRoute';   // Import PrivateRoute component
import LoginPage from './pages/auth/Login';       // Renamed for consistency with previous example
import SignupPage from './pages/auth/SignUp';     // Renamed for consistency with previous example
import DashboardPage from './pages/Dashboard/Dashboard'; // Renamed for consistency


function App() {
  return (
    <Router>
      {/* Wrap your entire application with AuthProvider */}
      <AuthProvider>
        {/* Optional: Render Navbar here if you want it on all pages */}
        {/* <Navbar /> */} 

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes - Use the PrivateRoute component */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Add other protected routes here if needed */}
          </Route>

          {/* Redirect users from the root path to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch-all for undefined routes, redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;