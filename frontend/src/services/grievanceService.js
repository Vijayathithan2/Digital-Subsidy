import { INITIAL_MOCK_GRIEVANCES } from '../data/mockData';

const STORAGE_KEY = 'gov_subsidy_grievances';

const getStoredGrievances = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_GRIEVANCES));
      return INITIAL_MOCK_GRIEVANCES;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load grievances from localStorage:', err);
    return INITIAL_MOCK_GRIEVANCES;
  }
};

const saveGrievances = (grievances) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grievances));
  } catch (err) {
    console.error('Failed to save grievances to localStorage:', err);
  }
};

export const grievanceService = {
  getAllGrievances: async () => {
    return getStoredGrievances();
  },

  getGrievanceByTrackingNumber: async (trackingNumber) => {
    const list = getStoredGrievances();
    const cleanNum = trackingNumber.trim().toUpperCase();
    const item = list.find((g) => g.trackingNumber.toUpperCase() === cleanNum || g.id.toUpperCase() === cleanNum);
    if (!item) {
      throw new Error(`No grievance record found for tracking number "${trackingNumber}".`);
    }
    return item;
  },

  submitGrievance: async ({ applicantName, applicantEmail, applicantPhone, category, applicationRef, subject, description }) => {
    const list = getStoredGrievances();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `GRV-2026-${randomDigits}`;

    const newGrievance = {
      id: trackingNumber,
      trackingNumber,
      applicantName: applicantName || 'Citizen Applicant',
      applicantEmail: applicantEmail || 'applicant@gov.in',
      applicantPhone: applicantPhone || '+91 9999999999',
      category: category || 'General Inquiry',
      applicationRef: applicationRef ? applicationRef.trim().toUpperCase() : 'N/A',
      subject: subject || 'Subsidy Portal Grievance',
      description: description || '',
      status: 'SUBMITTED',
      priority: 'MEDIUM',
      assignedOfficer: 'District Nodal Officer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      officerRemarks: 'Grievance received and registered in national queue. Pending review.',
    };

    const updatedList = [newGrievance, ...list];
    saveGrievances(updatedList);
    return newGrievance;
  },

  updateGrievanceStatus: async (id, { status, officerRemarks, assignedOfficer, priority }) => {
    const list = getStoredGrievances();
    const index = list.findIndex((g) => g.id === id || g.trackingNumber === id);
    if (index === -1) {
      throw new Error('Grievance record not found');
    }

    const current = list[index];
    const updated = {
      ...current,
      status: status || current.status,
      officerRemarks: officerRemarks !== undefined ? officerRemarks : current.officerRemarks,
      assignedOfficer: assignedOfficer || current.assignedOfficer,
      priority: priority || current.priority,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    saveGrievances(list);
    return updated;
  },
};
