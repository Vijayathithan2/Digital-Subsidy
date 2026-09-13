package com.example.governmentsubsidy.dto.disbursement;

import com.example.governmentsubsidy.dto.milestone.MilestoneRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class DisbursementPlanRequest {

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Total planned amount is required")
    @DecimalMin(value = "1.0", message = "Total planned amount must be at least 1.00")
    private BigDecimal totalPlannedAmount;

    @NotEmpty(message = "At least one milestone is required")
    @Valid
    private List<MilestoneRequest> milestones;

    public DisbursementPlanRequest() {}

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public BigDecimal getTotalPlannedAmount() {
        return totalPlannedAmount;
    }

    public void setTotalPlannedAmount(BigDecimal totalPlannedAmount) {
        this.totalPlannedAmount = totalPlannedAmount;
    }

    public List<MilestoneRequest> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<MilestoneRequest> milestones) {
        this.milestones = milestones;
    }
}
