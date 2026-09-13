package com.example.governmentsubsidy.dto.disbursement;

import com.example.governmentsubsidy.dto.milestone.MilestoneResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class DisbursementPlanResponse {

    private Long id;
    private Long applicationId;
    private String applicationNumber;
    private BigDecimal totalPlannedAmount;
    private BigDecimal totalReleasedAmount;
    private BigDecimal totalRemainingAmount;
    private String status;
    private List<MilestoneResponse> milestones;
    private LocalDateTime createdAt;

    public DisbursementPlanResponse() {}

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

    public BigDecimal getTotalPlannedAmount() {
        return totalPlannedAmount;
    }

    public void setTotalPlannedAmount(BigDecimal totalPlannedAmount) {
        this.totalPlannedAmount = totalPlannedAmount;
    }

    public BigDecimal getTotalReleasedAmount() {
        return totalReleasedAmount;
    }

    public void setTotalReleasedAmount(BigDecimal totalReleasedAmount) {
        this.totalReleasedAmount = totalReleasedAmount;
    }

    public BigDecimal getTotalRemainingAmount() {
        return totalRemainingAmount;
    }

    public void setTotalRemainingAmount(BigDecimal totalRemainingAmount) {
        this.totalRemainingAmount = totalRemainingAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<MilestoneResponse> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<MilestoneResponse> milestones) {
        this.milestones = milestones;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
