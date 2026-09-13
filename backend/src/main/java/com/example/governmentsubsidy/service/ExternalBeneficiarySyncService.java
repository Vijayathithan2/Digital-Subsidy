package com.example.governmentsubsidy.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ExternalBeneficiarySyncService {

    private static final Logger log = LoggerFactory.getLogger(ExternalBeneficiarySyncService.class);

    public record IdentityVerificationResponse(
            String identityNumber,
            boolean valid,
            String registrySource,
            String verificationCode,
            LocalDateTime verifiedAt
    ) {}

    public IdentityVerificationResponse verifyIdentityWithNationalRegistry(String identityNumber) {
        log.info("Querying National Social Security / Identity Registry for ID: {}", identityNumber);

        // Valid if non-empty and has at least 8 characters
        boolean isValid = identityNumber != null && identityNumber.trim().length() >= 8;

        return new IdentityVerificationResponse(
                identityNumber,
                isValid,
                "NATIONAL_AADHAAR_MOCK_REGISTRY",
                "VERIFIED-" + (int)(Math.random() * 90000 + 10000),
                LocalDateTime.now()
        );
    }
}
