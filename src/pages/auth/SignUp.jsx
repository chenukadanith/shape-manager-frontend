import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => { // Made the function async
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }


    try {
      // API call to your backend signup endpoint
      const response = await axiosInstance.post('/auth/register', {
        username: username,
        password: password,
        
      });

      setSuccess('Registration successful! Please log in.');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      console.error('Signup error:', err);
      
    } finally {
       
      console.log("signup successful");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card p-4 w-100" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-2">Sign Up</h2>
          <p className="text-center text-muted mb-5" style={{ fontSize: '1rem' }}>
          </p>
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                style={{color: '#0f172a'}}
                >
                Register
              </button>

              

            </div>
          </form>
          <p className="mt-4 text-center text-muted">
            Already have an account?{' '}
            <a href="/login" className="text-decoration-none text-muted" style={{color: '#000'}}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;