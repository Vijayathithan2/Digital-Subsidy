import api from './api';

export const integrationService = {
  testTreasuryTransfer: async ({ accountNumber, ifsc, amount, schemeCode }) => {
    const params = new URLSearchParams({
      accountNumber,
      ifsc,
      amount: String(amount),
      schemeCode,
    });
    // api interceptor already unwraps response.data
    return await api.post(`/api/integrations/treasury/test-transfer?${params.toString()}`); // TreasuryDisbursementResult
  },

  verifyIdentity: async (identityNumber) => {
    return await api.get(`/api/integrations/beneficiary/verify-identity?identityNumber=${encodeURIComponent(identityNumber)}`); // IdentityVerificationResponse
  },
};
