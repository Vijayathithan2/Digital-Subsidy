import api from './api';

export const utilizationService = {
  submitUtilization: async (applicationId, utilizationRequest) => {
    const response = await api.post(`/api/utilizations/application/${applicationId}`, utilizationRequest);
    return response.data; // UtilizationResponse
  },

  getUtilizationsByApplication: async (applicationId) => {
    const response = await api.get(`/api/utilizations/application/${applicationId}`);
    return response.data; // List<UtilizationResponse>
  },

  verifyUtilization: async (id, approved = true, remarks = 'Ground expenditure verified against submitted invoices') => {
    const query = new URLSearchParams({
      approved: String(approved),
      remarks: remarks || '',
    });
    const response = await api.post(`/api/utilizations/${id}/verify?${query.toString()}`);
    return response.data; // UtilizationResponse
  },
};
