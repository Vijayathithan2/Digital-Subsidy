import api from './api';

export const verificationService = {
  performFieldVerification: async (applicationId, { decision, remarks }) => {
    // api interceptor already unwraps response.data
    return await api.post(`/api/verifications/field/${applicationId}`, {
      decision,
      remarks,
    });
  },

  performDistrictReview: async (applicationId, { decision, remarks }) => {
    return await api.post(`/api/verifications/district/${applicationId}`, {
      decision,
      remarks,
    });
  },

  performFinanceApproval: async (applicationId, approvedAmount, { decision, remarks }) => {
    const query = approvedAmount ? `?approvedAmount=${approvedAmount}` : '';
    return await api.post(`/api/verifications/finance/${applicationId}${query}`, {
      decision,
      remarks,
    });
  },

  getVerificationsForApplication: async (applicationId) => {
    return await api.get(`/api/verifications/application/${applicationId}`);
  },
};
