// src/api/auth.js
import axiosInstance from '../utils/axiosInstance'; // Or just axios if not using instance

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials); // Adjust endpoint
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData); // Adjust endpoint
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProtectedData = async () => {
  try {
    const response = await axiosInstance.get('/api/protected'); // Example of a protected endpoint
    return response.data;
  } catch (error) {
    throw error;
  }
};