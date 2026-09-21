import api from './api';

export const analyticsService = {
  getDashboardAnalytics: async () => {
    // api interceptor already unwraps response.data
    return await api.get('/api/analytics/dashboard'); // DashboardAnalyticsResponse
  },

  getSchemeAnalytics: async () => {
    return await api.get('/api/analytics/schemes'); // List<SchemeAnalyticsDto>
  },

  getRegionAnalytics: async () => {
    return await api.get('/api/analytics/regions'); // List<RegionAnalyticsDto>
  },
};
