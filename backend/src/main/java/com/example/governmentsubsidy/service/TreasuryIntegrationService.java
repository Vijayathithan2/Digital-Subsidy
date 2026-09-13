package com.example.governmentsubsidy.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class TreasuryIntegrationService {

    private static final Logger log = LoggerFactory.getLogger(TreasuryIntegrationService.class);

    public record TreasuryDisbursementResult(
            String transactionReference,
            String treasuryVoucherNumber,
            String status,
            String message,
            LocalDateTime timestamp
    ) {}

    public TreasuryDisbursementResult processTreasuryTransfer(String beneficiaryAccount, String ifsc,
                                                             BigDecimal amount, String schemeCode) {
        log.info("Dispatching payment request to Treasury PFMS Gateway: Account={}, IFSC={}, Amount={}, Scheme={}",
                beneficiaryAccount, ifsc, amount, schemeCode);

        // Generate mock standard RBI/PFMS UTR number
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String randomStr = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String utr = "SBIN" + dateStr + randomStr;
        String voucherNo = "TREASURY-VCHR-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        log.info("Treasury acknowledgment received: UTR={}, Voucher={}, Status=SUCCESS", utr, voucherNo);

        return new TreasuryDisbursementResult(
                utr,
                voucherNo,
                "PROCESSED",
                "Direct Benefit Transfer successfully credited via Treasury Gateway",
                LocalDateTime.now()
        );
    }
}
