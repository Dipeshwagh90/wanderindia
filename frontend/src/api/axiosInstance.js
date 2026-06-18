import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('wanderindia-token');
    if (token) {
      try {
        // Parse token if stored as JSON string (with quotes)
        token = JSON.parse(token);
      } catch (e) {
        // Use raw token if not stored as JSON
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiry
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear stored auth
      localStorage.removeItem('wanderindia-token');
      localStorage.removeItem('wanderindia-user');
      // Redirect to login on 401 error
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
