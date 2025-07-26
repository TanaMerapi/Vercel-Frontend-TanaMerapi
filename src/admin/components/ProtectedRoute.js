import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../utils/api';
import Loader from '../../shared/components/Loader';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      try {
        // Attempt to refresh token
        await api.get('/auth/token');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication failed:', error);
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    verifyToken();
  }, []);
  
  if (loading) {
    return <Loader />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;