import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      // Check if token is expired
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        // Token expired, try to refresh
        try {
          const response = await axios.get(`${API_URL}/auth/token`, {
            withCredentials: true,
          });
          
          // Update localStorage with new token
          localStorage.setItem('accessToken', response.data.accessToken);
          
          // Update Authorization header
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        } catch (error) {
          // Clear tokens if refresh fails
          localStorage.removeItem('accessToken');
          
          // Redirect to login if unauthorized
          if (window.location.pathname.includes('/admin')) {
            window.location.href = '/admin/login';
          }
        }
      } else {
        // Token still valid, use it
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If unauthorized and in admin area, redirect to login
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.includes('/admin')) {
        localStorage.removeItem('accessToken');
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;