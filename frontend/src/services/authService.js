import api from './api';

export const authService = {
  login: async (credentials) => {
    // api interceptor already unwraps response.data, so response IS the payload
    const response = await api.post('/api/auth/login', credentials);
    return response; // LoginResponse: { token, type, id, username, email, fullName, roles }
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response; // UserResponse
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response; // UserResponse
  },
};
