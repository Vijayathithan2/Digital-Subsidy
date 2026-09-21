import api from './api';

export const disbursementService = {
  createPlan: async (planRequest) => {
    // api interceptor already unwraps response.data
    return await api.post('/api/disbursements/plan', planRequest); // DisbursementPlanResponse
  },

  getPlanByApplicationId: async (applicationId) => {
    return await api.get(`/api/disbursements/application/${applicationId}`); // DisbursementPlanResponse
  },

  releaseMilestoneFunds: async (milestoneId, releaseRequest) => {
    return await api.post(`/api/disbursements/milestones/${milestoneId}/release`, releaseRequest); // FundReleaseResponse
  },
};
