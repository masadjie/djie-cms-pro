import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: lampirkan JWT token dari localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tamiang_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauth & session expiration
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token kedaluwarsa atau tidak valid: bersihkan token dan redirect ke login admin
      localStorage.removeItem('tamiang_token');
      localStorage.removeItem('tamiang_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
