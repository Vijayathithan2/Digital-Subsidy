import api from './api';

export const analyticsService = {
  getDashboardAnalytics: async () => {
    const response = await api.get('/api/analytics/dashboard');
    return response.data; // DashboardAnalyticsResponse
  },

  getSchemeAnalytics: async () => {
    const response = await api.get('/api/analytics/schemes');
    return response.data; // List<SchemeAnalyticsDto>
  },

  getRegionAnalytics: async () => {
    const response = await api.get('/api/analytics/regions');
    return response.data; // List<RegionAnalyticsDto>
  },
};
