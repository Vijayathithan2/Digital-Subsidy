package com.example.governmentsubsidy.dto.utilization;

import com.example.governmentsubsidy.enums.UtilizationVerificationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UtilizationResponse {

    private Long id;
    private Long applicationId;
    private String applicationNumber;
    private BigDecimal approvedAmount;
    private BigDecimal totalReleasedAmount;
    private BigDecimal utilizedAmount;
    private BigDecimal remainingToUtilize;
    private BigDecimal utilizationPercentage;
    private String proofDocumentPath;
    private String remarks;
    private UtilizationVerificationStatus verificationStatus;
    private Long verifiedByUserId;
    private String verifiedByUsername;
    private LocalDateTime submittedAt;

    public UtilizationResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public BigDecimal getApprovedAmount() {
        return approvedAmount;
    }

    public void setApprovedAmount(BigDecimal approvedAmount) {
        this.approvedAmount = approvedAmount;
    }

    public BigDecimal getTotalReleasedAmount() {
        return totalReleasedAmount;
    }

    public void setTotalReleasedAmount(BigDecimal totalReleasedAmount) {
        this.totalReleasedAmount = totalReleasedAmount;
    }

    public BigDecimal getUtilizedAmount() {
        return utilizedAmount;
    }

    public void setUtilizedAmount(BigDecimal utilizedAmount) {
        this.utilizedAmount = utilizedAmount;
    }

    public BigDecimal getRemainingToUtilize() {
        return remainingToUtilize;
    }

    public void setRemainingToUtilize(BigDecimal remainingToUtilize) {
        this.remainingToUtilize = remainingToUtilize;
    }

    public BigDecimal getUtilizationPercentage() {
        return utilizationPercentage;
    }

    public void setUtilizationPercentage(BigDecimal utilizationPercentage) {
        this.utilizationPercentage = utilizationPercentage;
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

    public UtilizationVerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(UtilizationVerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Long getVerifiedByUserId() {
        return verifiedByUserId;
    }

    public void setVerifiedByUserId(Long verifiedByUserId) {
        this.verifiedByUserId = verifiedByUserId;
    }

    public String getVerifiedByUsername() {
        return verifiedByUsername;
    }

    public void setVerifiedByUsername(String verifiedByUsername) {
        this.verifiedByUsername = verifiedByUsername;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
