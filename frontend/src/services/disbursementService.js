import api from './api';

export const disbursementService = {
  createPlan: async (planRequest) => {
    const response = await api.post('/api/disbursements/plan', planRequest);
    return response.data; // DisbursementPlanResponse
  },

  getPlanByApplicationId: async (applicationId) => {
    const response = await api.get(`/api/disbursements/application/${applicationId}`);
    return response.data; // DisbursementPlanResponse
  },

  releaseMilestoneFunds: async (milestoneId, releaseRequest) => {
    const response = await api.post(`/api/disbursements/milestones/${milestoneId}/release`, releaseRequest);
    return response.data; // FundReleaseResponse
  },
};
