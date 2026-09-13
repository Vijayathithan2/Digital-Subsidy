import axios from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor for Bearer token
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error unwrapping and session expiry
api.interceptors.response.use(
  (response) => {
    // If response is a file blob/download, return directly
    if (response.config.responseType === 'blob') {
      return response;
    }
    return response.data;
  },
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    let details = [];

    if (error.response) {
      const { status, data } = error.response;

      if (data && typeof data === 'object') {
        if (data.message) message = data.message;
        if (data.details && Array.isArray(data.details)) details = data.details;
      }

      if (status === 401) {
        // Token expired or invalid
        storage.clearAuth();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      } else if (status === 403) {
        message = data.message || 'Access Denied: You do not possess the required government role authorization.';
      } else if (status === 404) {
        message = data.message || 'Requested government resource or application record was not found.';
      } else if (status === 500) {
        message = data.message || 'Internal Government Server Error. Please contact administrator.';
      }
    } else if (error.request) {
      message = 'Unable to connect to Government Subsidy Backend Server. Ensure Spring Boot is running on port 8080.';
    }

    const enhancedError = new Error(message);
    enhancedError.status = error.response ? error.response.status : 0;
    enhancedError.details = details;
    enhancedError.original = error;

    return Promise.reject(enhancedError);
  }
);

export default api;
