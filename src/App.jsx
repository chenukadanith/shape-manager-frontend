import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext'; 
import PrivateRoute from './auth/PrivateRoute';   
import LoginPage from './pages/auth/Login';      
import SignupPage from './pages/auth/SignUp';    
import DashboardPage from './pages/Dashboard/Dashboard'; 
import ShapeManager from './components/ShapeManager';


function App() {
  return (
    <Router>
      <AuthProvider>
       

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes  */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
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