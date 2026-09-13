import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data; // LoginResponse: { token, type, id, username, email, fullName, roles }
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data; // UserResponse
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data; // UserResponse
  },
};
