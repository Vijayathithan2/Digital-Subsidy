import api from './api';

export const schemeService = {
  getAllSchemes: async () => {
    const response = await api.get('/api/schemes');
    return response.data;
  },

  getActiveSchemes: async () => {
    const response = await api.get('/api/schemes/active');
    return response.data;
  },

  getSchemeById: async (id) => {
    const response = await api.get(`/api/schemes/${id}`);
    return response.data;
  },

  createScheme: async (schemeData) => {
    const response = await api.post('/api/schemes', schemeData);
    return response.data;
  },

  updateScheme: async (id, schemeData) => {
    const response = await api.put(`/api/schemes/${id}`, schemeData);
    return response.data;
  },
};
