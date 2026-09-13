import api from './api';

export const milestoneService = {
  getMilestoneById: async (id) => {
    const response = await api.get(`/api/milestones/${id}`);
    return response.data;
  },

  getMilestonesByApplication: async (applicationId) => {
    const response = await api.get(`/api/milestones/application/${applicationId}`);
    return response.data;
  },

  markComplianceSatisfied: async (id, remarks = 'Compliance verified by inspecting officer') => {
    const query = remarks ? `?remarks=${encodeURIComponent(remarks)}` : '';
    const response = await api.post(`/api/milestones/${id}/complete${query}`);
    return response.data;
  },

  getOverdueMilestones: async () => {
    const response = await api.get('/api/milestones/overdue');
    return response.data;
  },
};
