// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth'
import { useAuth } from '../../auth/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({ userName: username, password });
      console.log(response);
      // Assuming your backend returns a JWT in response.token or similar
      const { token, userDetails } = response;
      console.log("token",token, "userDetails", userDetails); // Adjust based on your backend response structure
      
      login(token, userDetails); // Update AuthContext and store token/user
      navigate('/dashboard'); // Redirect to a protected page after successful login
    } catch (err) {
      console.error('Login error:', err);
      // Check for specific error messages from the backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card p-4 w-100" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-2">Welcome back</h2>
          <p className="text-center text-muted mb-5" style={{ fontSize: '1rem' }}>
            Sign in to your shape management account
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-3 mt-4">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-muted">
            Don't have an account?{' '}
            <a href="/signup" className="text-primary text-decoration-none text-muted">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;