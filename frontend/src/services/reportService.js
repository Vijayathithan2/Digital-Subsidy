import api from './api';

const downloadBlobAsFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const reportService = {
  downloadSchemeReport: async () => {
    const res = await api.get('/api/reports/schemes/csv', { responseType: 'blob' });
    downloadBlobAsFile(new Blob([res.data], { type: 'text/csv' }), 'scheme_summary.csv');
  },

  downloadRegionReport: async () => {
    const res = await api.get('/api/reports/regions/csv', { responseType: 'blob' });
    downloadBlobAsFile(new Blob([res.data], { type: 'text/csv' }), 'region_summary.csv');
  },

  downloadDisbursementReport: async () => {
    const res = await api.get('/api/reports/disbursements/csv', { responseType: 'blob' });
    downloadBlobAsFile(new Blob([res.data], { type: 'text/csv' }), 'disbursements.csv');
  },

  downloadMilestonesReport: async () => {
    const res = await api.get('/api/reports/milestones/csv', { responseType: 'blob' });
    downloadBlobAsFile(new Blob([res.data], { type: 'text/csv' }), 'overdue_milestones.csv');
  },

  downloadUtilizationReport: async () => {
    const res = await api.get('/api/reports/utilizations/csv', { responseType: 'blob' });
    downloadBlobAsFile(new Blob([res.data], { type: 'text/csv' }), 'utilizations.csv');
  },
};
