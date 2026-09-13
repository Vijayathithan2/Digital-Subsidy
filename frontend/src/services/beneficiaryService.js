import api from './api';

export const beneficiaryService = {
  registerProfile: async (profileData) => {
    const response = await api.post('/api/beneficiaries', profileData);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get('/api/beneficiaries/me');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/beneficiaries/${id}`);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/api/beneficiaries');
    return response.data;
  },

  updateKycStatus: async (id, status) => {
    const response = await api.patch(`/api/beneficiaries/${id}/kyc?status=${status}`);
    return response.data;
  },
};
