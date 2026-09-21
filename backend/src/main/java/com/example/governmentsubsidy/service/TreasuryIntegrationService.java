package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.integration.PfmsTreasuryGatewayClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TreasuryIntegrationService {

    private final PfmsTreasuryGatewayClient pfmsGatewayClient;

    public TreasuryIntegrationService(PfmsTreasuryGatewayClient pfmsGatewayClient) {
        this.pfmsGatewayClient = pfmsGatewayClient;
    }

    public record TreasuryDisbursementResult(
            String transactionReference,
            String treasuryVoucherNumber,
            String status,
            String message,
            LocalDateTime timestamp
    ) {}

    public TreasuryDisbursementResult processTreasuryTransfer(String beneficiaryAccount, String ifsc,
                                                             BigDecimal amount, String schemeCode) {
        PfmsTreasuryGatewayClient.PfmsTransferResponse response = pfmsGatewayClient.executeDbtTransfer(
                beneficiaryAccount, ifsc, amount, schemeCode
        );

        return new TreasuryDisbursementResult(
                response.utrReference(),
                response.treasuryVoucherNumber(),
                response.status(),
                response.message(),
                response.timestamp()
        );
    }
}
