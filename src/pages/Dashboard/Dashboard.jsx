import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Shape Management!</h2>
        <p className="text-lg text-gray-600 mb-6">You are now logged in.</p>
        <p className="text-md text-gray-700 mb-8">
          This is where you'll integrate your shape management and drawing features.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;