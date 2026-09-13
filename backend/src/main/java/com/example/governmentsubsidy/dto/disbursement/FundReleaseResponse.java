package com.example.governmentsubsidy.dto.disbursement;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FundReleaseResponse {

    private Long id;
    private Long milestoneId;
    private int milestoneSequence;
    private String milestoneTitle;
    private String transactionRefNumber;
    private BigDecimal releasedAmount;
    private Long releasedByUserId;
    private String releasedByUsername;
    private String paymentMode;
    private String treasuryStatus;
    private LocalDateTime releasedAt;

    public FundReleaseResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(Long milestoneId) {
        this.milestoneId = milestoneId;
    }

    public int getMilestoneSequence() {
        return milestoneSequence;
    }

    public void setMilestoneSequence(int milestoneSequence) {
        this.milestoneSequence = milestoneSequence;
    }

    public String getMilestoneTitle() {
        return milestoneTitle;
    }

    public void setMilestoneTitle(String milestoneTitle) {
        this.milestoneTitle = milestoneTitle;
    }

    public String getTransactionRefNumber() {
        return transactionRefNumber;
    }

    public void setTransactionRefNumber(String transactionRefNumber) {
        this.transactionRefNumber = transactionRefNumber;
    }

    public BigDecimal getReleasedAmount() {
        return releasedAmount;
    }

    public void setReleasedAmount(BigDecimal releasedAmount) {
        this.releasedAmount = releasedAmount;
    }

    public Long getReleasedByUserId() {
        return releasedByUserId;
    }

    public void setReleasedByUserId(Long releasedByUserId) {
        this.releasedByUserId = releasedByUserId;
    }

    public String getReleasedByUsername() {
        return releasedByUsername;
    }

    public void setReleasedByUsername(String releasedByUsername) {
        this.releasedByUsername = releasedByUsername;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getTreasuryStatus() {
        return treasuryStatus;
    }

    public void setTreasuryStatus(String treasuryStatus) {
        this.treasuryStatus = treasuryStatus;
    }

    public LocalDateTime getReleasedAt() {
        return releasedAt;
    }

    public void setReleasedAt(LocalDateTime releasedAt) {
        this.releasedAt = releasedAt;
    }
}
