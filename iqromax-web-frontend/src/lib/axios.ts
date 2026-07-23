import axios from 'axios';

// Local dev => localhost:8000, Production => iqromax-web-backend.onrender.com
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const DEFAULT_API_URL = isLocalhost
  ? `http://${window.location.hostname}:8000/api/`
  : 'https://iqromax-web-backend.onrender.com/api/';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL,
});

// Request interceptor: JWT token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: 401 bo'lsa tokenni o'chirib login sahifasiga yo'naltirish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Login sahifasiga yo'naltirish (faqat admin sahifasida bo'lsak)
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const apiBase = import.meta.env.VITE_API_URL || (isLocal
    ? `http://${window.location.hostname}:8000/api/`
    : 'https://iqromax-web-backend.onrender.com/api/');
  const base = apiBase.replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default api;
