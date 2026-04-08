import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode JWT locally to confirm it's actually expired before clearing session.
        // This prevents network hiccups / transient 401s from logging the user out prematurely.
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = payload.exp && Date.now() / 1000 > payload.exp;
          if (isExpired) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event("storage"));
            if (window.location.pathname !== '/') {
              window.location.href = '/?session_expired=true';
            }
          }
          // If token is NOT expired, silently reject - don't log out
        } catch {
          // If we can't decode the token, it's malformed - clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event("storage"));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
