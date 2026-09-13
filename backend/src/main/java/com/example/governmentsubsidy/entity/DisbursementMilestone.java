package com.example.governmentsubsidy.entity;

import com.example.governmentsubsidy.enums.MilestoneReleaseStatus;
import com.example.governmentsubsidy.enums.MilestoneType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "disbursement_milestones")
public class DisbursementMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private DisbursementPlan plan;

    @Column(name = "sequence_number", nullable = false)
    private int sequenceNumber;

    @Column(name = "title", length = 150, nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "milestone_type", length = 50, nullable = false)
    private MilestoneType milestoneType;

    @Column(name = "scheduled_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal scheduledAmount;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "compliance_condition", columnDefinition = "TEXT")
    private String complianceCondition;

    @Column(name = "is_compliance_satisfied", nullable = false)
    private boolean complianceSatisfied = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "release_status", length = 30, nullable = false)
    private MilestoneReleaseStatus releaseStatus = MilestoneReleaseStatus.PENDING;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToOne(mappedBy = "milestone", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private FundRelease fundRelease;

    public DisbursementMilestone() {}

    public DisbursementMilestone(DisbursementPlan plan, int sequenceNumber, String title,
                                 MilestoneType milestoneType, BigDecimal scheduledAmount,
                                 LocalDate dueDate, String complianceCondition) {
        this.plan = plan;
        this.sequenceNumber = sequenceNumber;
        this.title = title;
        this.milestoneType = milestoneType;
        this.scheduledAmount = scheduledAmount;
        this.dueDate = dueDate;
        this.complianceCondition = complianceCondition;
        this.complianceSatisfied = false;
        this.releaseStatus = MilestoneReleaseStatus.PENDING;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DisbursementPlan getPlan() {
        return plan;
    }

    public void setPlan(DisbursementPlan plan) {
        this.plan = plan;
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

    public FundRelease getFundRelease() {
        return fundRelease;
    }

    public void setFundRelease(FundRelease fundRelease) {
        this.fundRelease = fundRelease;
        if (fundRelease != null) {
            fundRelease.setMilestone(this);
        }
    }
}
