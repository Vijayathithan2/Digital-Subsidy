import api from './api';

export const auditService = {
  getAllAuditLogs: async () => {
    const response = await api.get('/api/audit-logs');
    return response.data; // List<AuditLogResponse>
  },

  getByEntity: async (name, id) => {
    const response = await api.get(`/api/audit-logs/entity/${name}/${id}`);
    return response.data;
  },

  getByUser: async (username) => {
    const response = await api.get(`/api/audit-logs/user/${username}`);
    return response.data;
  },
};
