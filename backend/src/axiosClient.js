// src/axiosClient.js
import axios from 'axios';
import router from './router';

const BACKEND = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const axiosClient = axios.create({
  baseURL: `${BACKEND.replace(/\/$/, '')}/api`,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // enable if using Laravel Sanctum (cookie-based auth)
});

// Request interceptor — attach token if present
axiosClient.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  const TOKEN = sessionStorage.getItem('TOKEN') || localStorage.getItem('TOKEN');
  if (TOKEN) config.headers.Authorization = `Bearer ${TOKEN}`;
  else delete config.headers.Authorization;
  return config;
}, (err) => Promise.reject(err));

// Response interceptor — handle 401 globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      sessionStorage.removeItem('TOKEN');
      localStorage.removeItem('TOKEN');
      router.push({ name: 'login' });
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
