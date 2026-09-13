package com.example.governmentsubsidy.dto.verification;

import com.example.governmentsubsidy.enums.VerificationDecision;
import jakarta.validation.constraints.NotNull;

public class VerificationRequest {

    @NotNull(message = "Decision is required")
    private VerificationDecision decision;

    private String remarks;

    public VerificationRequest() {}

    public VerificationRequest(VerificationDecision decision, String remarks) {
        this.decision = decision;
        this.remarks = remarks;
    }

    public VerificationDecision getDecision() {
        return decision;
    }

    public void setDecision(VerificationDecision decision) {
        this.decision = decision;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
