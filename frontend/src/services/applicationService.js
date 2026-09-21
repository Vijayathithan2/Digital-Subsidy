import api from './api';

export const applicationService = {
  createApplication: async (applicationRequest) => {
    // api interceptor already unwraps response.data
    return await api.post('/api/applications', applicationRequest);
  },

  submitApplication: async (id) => {
    return await api.post(`/api/applications/${id}/submit`);
  },

  attachDocument: async (id, documentType, fileName, fileType = 'application/pdf', filePath) => {
    const params = new URLSearchParams({
      documentType,
      fileName,
      fileType,
      filePath: filePath || `uploads/documents/${fileName}`,
    });
    return await api.post(`/api/applications/${id}/documents?${params.toString()}`);
  },

  evaluateEligibility: async (id) => {
    return await api.post(`/api/applications/${id}/evaluate-eligibility`); // EligibilityEvaluationResult
  },

  getApplicationById: async (id) => {
    return await api.get(`/api/applications/${id}`); // ApplicationResponse
  },

  getMyApplications: async () => {
    return await api.get('/api/applications/my'); // List<ApplicationResponse>
  },

  getAllApplications: async (status = null) => {
    const url = status ? `/api/applications?status=${status}` : '/api/applications';
    return await api.get(url); // List<ApplicationResponse>
  },
};
