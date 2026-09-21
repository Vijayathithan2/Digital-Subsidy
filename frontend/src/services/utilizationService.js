import api from './api';

export const utilizationService = {
  submitUtilization: async (applicationId, utilizationRequest) => {
    // api interceptor already unwraps response.data
    return await api.post(`/api/utilizations/application/${applicationId}`, utilizationRequest); // UtilizationResponse
  },

  getUtilizationsByApplication: async (applicationId) => {
    return await api.get(`/api/utilizations/application/${applicationId}`); // List<UtilizationResponse>
  },

  verifyUtilization: async (id, approved = true, remarks = 'Ground expenditure verified against submitted invoices') => {
    const query = new URLSearchParams({
      approved: String(approved),
      remarks: remarks || '',
    });
    return await api.post(`/api/utilizations/${id}/verify?${query.toString()}`); // UtilizationResponse
  },
};
