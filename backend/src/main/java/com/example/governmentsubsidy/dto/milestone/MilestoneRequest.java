package com.example.governmentsubsidy.dto.milestone;

import com.example.governmentsubsidy.enums.MilestoneType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MilestoneRequest {

    private int sequenceNumber;

    @NotBlank(message = "Milestone title is required")
    private String title;

    @NotNull(message = "Milestone type is required")
    private MilestoneType milestoneType;

    @NotNull(message = "Scheduled amount is required")
    @DecimalMin(value = "0.01", message = "Scheduled amount must be positive")
    private BigDecimal scheduledAmount;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private String complianceCondition;

    public MilestoneRequest() {}

    public MilestoneRequest(int sequenceNumber, String title, MilestoneType milestoneType,
                            BigDecimal scheduledAmount, LocalDate dueDate, String complianceCondition) {
        this.sequenceNumber = sequenceNumber;
        this.title = title;
        this.milestoneType = milestoneType;
        this.scheduledAmount = scheduledAmount;
        this.dueDate = dueDate;
        this.complianceCondition = complianceCondition;
    }

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public MilestoneType getMilestoneType() {
        return milestoneType;
    }

    public void setMilestoneType(MilestoneType milestoneType) {
        this.milestoneType = milestoneType;
    }

    public BigDecimal getScheduledAmount() {
        return scheduledAmount;
    }

    public void setScheduledAmount(BigDecimal scheduledAmount) {
        this.scheduledAmount = scheduledAmount;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getComplianceCondition() {
        return complianceCondition;
    }

    public void setComplianceCondition(String complianceCondition) {
        this.complianceCondition = complianceCondition;
    }
}
