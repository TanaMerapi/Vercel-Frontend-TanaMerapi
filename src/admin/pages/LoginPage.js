import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './LoginPage.scss';
import { LogIn } from 'lucide-react';
import Message from '../../shared/components/Message';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [debugInfo, setDebugInfo] = useState(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify token validity
      api.get('/auth/token')
        .then(() => {
          navigate('/admin');
        })
        .catch((err) => {
          // If token is invalid, remove it
          localStorage.removeItem('accessToken');
          console.error('Token validation failed:', err);
        });
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Username dan password diperlukan');
      return;
    }
    
    setLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      // First, let's check if the API is reachable
      const healthCheck = await fetch(process.env.REACT_APP_API_URL.replace('/api', ''));
      const healthCheckData = await healthCheck.text();
      console.log('API Health Check:', healthCheckData);
      
      // Now attempt login
      const response = await api.post('/auth/login', formData);
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/admin');
      } else {
        setError('Terjadi kesalahan saat login');
        setDebugInfo('Received response but no access token');
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      let errorDetail = {
        message: 'Unknown error',
        status: error.response?.status || 'No status',
        data: error.response?.data || 'No data'
      };
      
      setDebugInfo(JSON.stringify(errorDetail, null, 2));
      
      if (error.response) {
        // Handle different error responses
        if (error.response.status === 404) {
          setError('Username tidak ditemukan');
        } else if (error.response.status === 400) {
          setError('Password salah');
        } else if (error.response.status === 500) {
          setError('Terjadi kesalahan server. Cek log untuk detail.');
        } else {
          setError(`Error status: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        setError('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
      } else {
        setError('Terjadi kesalahan saat login: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Tanah Merapi</h1>
          <p>Admin Dashboard</p>
        </div>
        
        {error && (
          <Message 
            type="error" 
            message={error} 
            onClose={() => setError(null)}
          />
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : (
              <>
                <LogIn size={20} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <a href="/" className="back-link">
            Kembali ke Website
          </a>
        </div>
        
        {debugInfo && (
          <div className="debug-info">
            <h4>Debug Information:</h4>
            <pre>{debugInfo}</pre>
            <p>API URL: {process.env.REACT_APP_API_URL}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;