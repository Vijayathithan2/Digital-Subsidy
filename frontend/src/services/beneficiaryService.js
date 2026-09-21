import api from './api';

export const beneficiaryService = {
  registerProfile: async (profileData) => {
    // api interceptor already unwraps response.data
    return await api.post('/api/beneficiaries', profileData);
  },

  getMyProfile: async () => {
    return await api.get('/api/beneficiaries/me');
  },

  getById: async (id) => {
    return await api.get(`/api/beneficiaries/${id}`);
  },

  getAll: async () => {
    return await api.get('/api/beneficiaries');
  },

  updateKycStatus: async (id, status) => {
    return await api.patch(`/api/beneficiaries/${id}/kyc?status=${status}`);
  },
};
