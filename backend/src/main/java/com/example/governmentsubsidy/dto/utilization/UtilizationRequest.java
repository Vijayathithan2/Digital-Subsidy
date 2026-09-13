package com.example.governmentsubsidy.dto.utilization;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class UtilizationRequest {

    @NotNull(message = "Utilized amount is required")
    @DecimalMin(value = "0.01", message = "Utilized amount must be positive")
    private BigDecimal utilizedAmount;

    private String proofDocumentPath;

    private String remarks;

    public UtilizationRequest() {}

    public UtilizationRequest(BigDecimal utilizedAmount, String proofDocumentPath, String remarks) {
        this.utilizedAmount = utilizedAmount;
        this.proofDocumentPath = proofDocumentPath;
        this.remarks = remarks;
    }

    public BigDecimal getUtilizedAmount() {
        return utilizedAmount;
    }

    public void setUtilizedAmount(BigDecimal utilizedAmount) {
        this.utilizedAmount = utilizedAmount;
    }

    public String getProofDocumentPath() {
        return proofDocumentPath;
    }

    public void setProofDocumentPath(String proofDocumentPath) {
        this.proofDocumentPath = proofDocumentPath;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
