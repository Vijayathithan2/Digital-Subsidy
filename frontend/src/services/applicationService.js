import api from './api';

export const applicationService = {
  createApplication: async (applicationRequest) => {
    const response = await api.post('/api/applications', applicationRequest);
    return response.data;
  },

  submitApplication: async (id) => {
    const response = await api.post(`/api/applications/${id}/submit`);
    return response.data;
  },

  attachDocument: async (id, documentType, fileName, fileType = 'application/pdf', filePath) => {
    const params = new URLSearchParams({
      documentType,
      fileName,
      fileType,
      filePath: filePath || `uploads/documents/${fileName}`,
    });
    const response = await api.post(`/api/applications/${id}/documents?${params.toString()}`);
    return response.data;
  },

  evaluateEligibility: async (id) => {
    const response = await api.post(`/api/applications/${id}/evaluate-eligibility`);
    return response.data; // EligibilityEvaluationResult
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/api/applications/${id}`);
    return response.data; // ApplicationResponse
  },

  getMyApplications: async () => {
    const response = await api.get('/api/applications/my');
    return response.data; // List<ApplicationResponse>
  },

  getAllApplications: async (status = null) => {
    const url = status ? `/api/applications?status=${status}` : '/api/applications';
    const response = await api.get(url);
    return response.data; // List<ApplicationResponse>
  },
};
