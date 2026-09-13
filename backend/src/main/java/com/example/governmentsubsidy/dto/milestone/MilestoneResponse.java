package com.example.governmentsubsidy.dto.milestone;

import com.example.governmentsubsidy.enums.MilestoneReleaseStatus;
import com.example.governmentsubsidy.enums.MilestoneType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MilestoneResponse {

    private Long id;
    private Long planId;
    private int sequenceNumber;
    private String title;
    private MilestoneType milestoneType;
    private BigDecimal scheduledAmount;
    private LocalDate dueDate;
    private String complianceCondition;
    private boolean complianceSatisfied;
    private MilestoneReleaseStatus releaseStatus;
    private LocalDateTime completedAt;
    private String transactionRefNumber;
    private BigDecimal releasedAmount;
    private LocalDateTime releasedAt;

    public MilestoneResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
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

    public boolean isComplianceSatisfied() {
        return complianceSatisfied;
    }

    public void setComplianceSatisfied(boolean complianceSatisfied) {
        this.complianceSatisfied = complianceSatisfied;
    }

    public MilestoneReleaseStatus getReleaseStatus() {
        return releaseStatus;
    }

    public void setReleaseStatus(MilestoneReleaseStatus releaseStatus) {
        this.releaseStatus = releaseStatus;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
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

    public LocalDateTime getReleasedAt() {
        return releasedAt;
    }

    public void setReleasedAt(LocalDateTime releasedAt) {
        this.releasedAt = releasedAt;
    }
}
