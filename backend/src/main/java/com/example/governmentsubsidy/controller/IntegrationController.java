package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.service.ExternalBeneficiarySyncService;
import com.example.governmentsubsidy.service.TreasuryIntegrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/integrations")
@PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_OFFICER')")
public class IntegrationController {

    private final TreasuryIntegrationService treasuryService;
    private final ExternalBeneficiarySyncService externalSyncService;

    public IntegrationController(TreasuryIntegrationService treasuryService,
                                 ExternalBeneficiarySyncService externalSyncService) {
        this.treasuryService = treasuryService;
        this.externalSyncService = externalSyncService;
    }

    @PostMapping("/treasury/test-transfer")
    public ResponseEntity<ApiResponse<TreasuryIntegrationService.TreasuryDisbursementResult>> testTreasury(
            @RequestParam String accountNumber,
            @RequestParam String ifsc,
            @RequestParam BigDecimal amount,
            @RequestParam String schemeCode) {
        TreasuryIntegrationService.TreasuryDisbursementResult res =
                treasuryService.processTreasuryTransfer(accountNumber, ifsc, amount, schemeCode);
        return ResponseEntity.ok(ApiResponse.success("Treasury transfer simulated successfully", res));
    }

    @GetMapping("/beneficiary/verify-identity")
    public ResponseEntity<ApiResponse<ExternalBeneficiarySyncService.IdentityVerificationResponse>> verifyIdentity(
            @RequestParam String identityNumber) {
        ExternalBeneficiarySyncService.IdentityVerificationResponse res =
                externalSyncService.verifyIdentityWithNationalRegistry(identityNumber);
        return ResponseEntity.ok(ApiResponse.success("Identity verification check completed", res));
    }
}
