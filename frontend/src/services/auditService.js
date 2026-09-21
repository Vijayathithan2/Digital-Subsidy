import api from './api';

export const auditService = {
  getAllAuditLogs: async () => {
    // api interceptor already unwraps response.data
    return await api.get('/api/audit-logs'); // List<AuditLogResponse>
  },

  getByEntity: async (name, id) => {
    return await api.get(`/api/audit-logs/entity/${name}/${id}`);
  },

  getByUser: async (username) => {
    return await api.get(`/api/audit-logs/user/${username}`);
  },
};
