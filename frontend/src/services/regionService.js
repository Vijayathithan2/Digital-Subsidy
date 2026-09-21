import api from './api';

export const regionService = {
  getAllRegions: async () => {
    // api interceptor already unwraps response.data
    return await api.get('/api/regions'); // List<Region>
  },

  getRegionById: async (id) => {
    return await api.get(`/api/regions/${id}`); // Region
  },

  createRegion: async (regionData) => {
    return await api.post('/api/regions', regionData); // Region
  },
};
