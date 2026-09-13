import api from './api';

export const integrationService = {
  testTreasuryTransfer: async ({ accountNumber, ifsc, amount, schemeCode }) => {
    const params = new URLSearchParams({
      accountNumber,
      ifsc,
      amount: String(amount),
      schemeCode,
    });
    const response = await api.post(`/api/integrations/treasury/test-transfer?${params.toString()}`);
    return response.data; // TreasuryDisbursementResult
  },

  verifyIdentity: async (identityNumber) => {
    const response = await api.get(`/api/integrations/beneficiary/verify-identity?identityNumber=${encodeURIComponent(identityNumber)}`);
    return response.data; // IdentityVerificationResponse
  },
};
