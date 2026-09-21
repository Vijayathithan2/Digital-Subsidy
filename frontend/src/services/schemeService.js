import api from './api';

export const schemeService = {
  getAllSchemes: async () => {
    // api interceptor already unwraps response.data
    return await api.get('/api/schemes');
  },

  getActiveSchemes: async () => {
    return await api.get('/api/schemes/active');
  },

  getSchemeById: async (id) => {
    return await api.get(`/api/schemes/${id}`);
  },

  createScheme: async (schemeData) => {
    return await api.post('/api/schemes', schemeData);
  },

  updateScheme: async (id, schemeData) => {
    return await api.put(`/api/schemes/${id}`, schemeData);
  },
};
