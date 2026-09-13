package com.example.governmentsubsidy.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "disbursement_plans")
public class DisbursementPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private SubsidyApplication application;

    @Column(name = "total_planned_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal totalPlannedAmount;

    @Column(name = "total_released_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal totalReleasedAmount = BigDecimal.ZERO;

    @Column(name = "total_remaining_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal totalRemainingAmount;

    @Column(name = "status", length = 30, nullable = false)
    private String status = "ACTIVE";

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<DisbursementMilestone> milestones = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public DisbursementPlan() {}

    public DisbursementPlan(SubsidyApplication application, BigDecimal totalPlannedAmount) {
        this.application = application;
        this.totalPlannedAmount = totalPlannedAmount;
        this.totalReleasedAmount = BigDecimal.ZERO;
        this.totalRemainingAmount = totalPlannedAmount;
        this.status = "ACTIVE";
    }

    public void addMilestone(DisbursementMilestone milestone) {
        milestones.add(milestone);
        milestone.setPlan(this);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SubsidyApplication getApplication() {
        return application;
    }

    public void setApplication(SubsidyApplication application) {
        this.application = application;
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

    public List<DisbursementMilestone> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<DisbursementMilestone> milestones) {
        this.milestones = milestones;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
