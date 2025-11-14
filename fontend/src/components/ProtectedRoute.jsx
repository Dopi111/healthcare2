import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  try {
    const token = localStorage.getItem('token'); // Khai báo lấy token
    if (!token) {
      
      return <Navigate to="/Admin/auth/Login" replace />; 
    }

    return children;
  } catch (err) {

    return <Navigate to="/Admin/auth/Login" replace />;
  }
};

export default ProtectedRoute;
