/**
 * API Configuration
 * Centralized API client with axios
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - only redirect if not already on a login page
      const currentPath = window.location.pathname;
      const isOnLoginPage = currentPath.includes('/Login') || currentPath.includes('/login');

      if (!isOnLoginPage) {
        // Clear auth tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');

        // Redirect to appropriate login page based on current location
        if (currentPath.includes('/Admin')) {
          window.location.href = '/Admin/Login';
        } else if (currentPath.includes('/User')) {
          window.location.href = '/User/Login';
        } else {
          window.location.href = '/Admin/Login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
