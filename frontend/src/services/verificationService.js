import api from './api';

export const verificationService = {
  performFieldVerification: async (applicationId, { decision, remarks }) => {
    const response = await api.post(`/api/verifications/field/${applicationId}`, {
      decision,
      remarks,
    });
    return response.data;
  },

  performDistrictReview: async (applicationId, { decision, remarks }) => {
    const response = await api.post(`/api/verifications/district/${applicationId}`, {
      decision,
      remarks,
    });
    return response.data;
  },

  performFinanceApproval: async (applicationId, approvedAmount, { decision, remarks }) => {
    const query = approvedAmount ? `?approvedAmount=${approvedAmount}` : '';
    const response = await api.post(`/api/verifications/finance/${applicationId}${query}`, {
      decision,
      remarks,
    });
    return response.data;
  },

  getVerificationsForApplication: async (applicationId) => {
    const response = await api.get(`/api/verifications/application/${applicationId}`);
    return response.data;
  },
};
