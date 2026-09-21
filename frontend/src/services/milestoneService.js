import api from './api';

export const milestoneService = {
  getMilestoneById: async (id) => {
    // api interceptor already unwraps response.data
    return await api.get(`/api/milestones/${id}`);
  },

  getMilestonesByApplication: async (applicationId) => {
    return await api.get(`/api/milestones/application/${applicationId}`);
  },

  markComplianceSatisfied: async (id, remarks = 'Compliance verified by inspecting officer') => {
    const query = remarks ? `?remarks=${encodeURIComponent(remarks)}` : '';
    return await api.post(`/api/milestones/${id}/complete${query}`);
  },

  getOverdueMilestones: async () => {
    return await api.get('/api/milestones/overdue');
  },
};
