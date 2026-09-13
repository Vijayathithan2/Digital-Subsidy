import api from './api';

export const regionService = {
  getAllRegions: async () => {
    const response = await api.get('/api/regions');
    return response.data; // List<Region>
  },

  getRegionById: async (id) => {
    const response = await api.get(`/api/regions/${id}`);
    return response.data; // Region
  },

  createRegion: async (regionData) => {
    const response = await api.post('/api/regions', regionData);
    return response.data; // Region
  },
};
