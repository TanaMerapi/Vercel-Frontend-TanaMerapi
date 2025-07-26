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
  
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify token validity
      api.get('/auth/token')
        .then(() => {
          navigate('/admin');
        })
        .catch(() => {
          // If token is invalid, remove it
          localStorage.removeItem('accessToken');
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
    
    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/admin');
      } else {
        setError('Terjadi kesalahan saat login');
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.response) {
        // Handle different error responses
        if (error.response.status === 404) {
          setError('Username tidak ditemukan');
        } else if (error.response.status === 400) {
          setError('Password salah');
        } else {
          setError('Terjadi kesalahan saat login');
        }
      } else {
        setError('Tidak dapat terhubung ke server');
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
      </div>
    </div>
  );
};

export default LoginPage;