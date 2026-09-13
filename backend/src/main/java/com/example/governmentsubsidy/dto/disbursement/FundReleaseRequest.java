package com.example.governmentsubsidy.dto.disbursement;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class FundReleaseRequest {

    @NotNull(message = "Release amount is required")
    @DecimalMin(value = "0.01", message = "Release amount must be positive")
    private BigDecimal amount;

    private String paymentMode;

    private String remarks;

    public FundReleaseRequest() {}

    public FundReleaseRequest(BigDecimal amount, String paymentMode, String remarks) {
        this.amount = amount;
        this.paymentMode = paymentMode;
        this.remarks = remarks;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
