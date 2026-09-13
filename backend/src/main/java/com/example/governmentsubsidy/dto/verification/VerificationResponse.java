package com.example.governmentsubsidy.dto.verification;

import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.VerificationDecision;
import com.example.governmentsubsidy.enums.VerificationStage;

import java.time.LocalDateTime;

public class VerificationResponse {

    private Long id;
    private Long applicationId;
    private String applicationNumber;
    private VerificationStage stage;
    private Long verifiedByUserId;
    private String verifiedByUsername;
    private VerificationDecision decision;
    private String remarks;
    private ApplicationStatus resultingStatus;
    private LocalDateTime verifiedAt;

    public VerificationResponse() {}

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

    public VerificationStage getStage() {
        return stage;
    }

    public void setStage(VerificationStage stage) {
        this.stage = stage;
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

    public ApplicationStatus getResultingStatus() {
        return resultingStatus;
    }

    public void setResultingStatus(ApplicationStatus resultingStatus) {
        this.resultingStatus = resultingStatus;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}
