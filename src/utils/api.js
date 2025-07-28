import axios from 'axios';

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://render-backend-tanamerapi.onrender.com/api',
  withCredentials: true, // Important for cookies/auth
  timeout: 30000, // 30 seconds timeout
});

// Log the API URL during initialization
console.log('API Client initialized with baseURL:', api.defaults.baseURL);

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Add verbose logging for file uploads
    if (config.data instanceof FormData) {
      console.log(`Sending ${config.method.toUpperCase()} request to ${config.url} with FormData:`, {
        url: config.url,
        method: config.method,
        formDataFields: [...config.data.keys()].map(key => {
          const value = config.data.get(key);
          if (value instanceof File) {
            return `${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`;
          }
          return `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`;
        })
      });
    } else {
      console.log(`Sending ${config.method.toUpperCase()} request to ${config.url}`);
    }
    
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`Response from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    return response;
  },
  async (error) => {
    // Log detailed error information
    console.error('API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response.status === 401) {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Refresh the page to redirect to login if on a protected route
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error (no response):', {
        request: error.request,
        config: error.config
      });
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error setting up request:', error.message);
    }
    
    // Handle Cloudinary-specific errors
    if (error.message && error.message.includes('NetworkError')) {
      console.error('Network error - possible CORS or connection issue');
    }
    
    if (error.message && error.message.includes('timeout')) {
      console.error('Request timed out - server might be overloaded or unreachable');
    }
    
    // Handle file upload errors
    if (error.config && error.config.data instanceof FormData) {
      console.error('Error during file upload:', {
        url: error.config.url,
        method: error.config.method,
        formDataFields: [...error.config.data.keys()]
      });
    }
    
    return Promise.reject(error);
  }
);

// Helper function for file uploads
api.uploadFile = async (url, formData, config = {}) => {
  try {
    // Log the form data contents
    console.log('Uploading file to', url);
    console.log('FormData contents:', [...formData.entries()].map(([key, value]) => {
      if (value instanceof File) {
        return `${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`;
      }
      return `${key}: ${value}`;
    }));
    
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config
    });
    
    return response.data;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

export default api;