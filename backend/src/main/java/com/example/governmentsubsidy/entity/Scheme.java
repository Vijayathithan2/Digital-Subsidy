package com.example.governmentsubsidy.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "schemes")
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", length = 50, nullable = false, unique = true)
    private String code;

    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "department", length = 100, nullable = false)
    private String department;

    @Column(name = "total_budget", precision = 18, scale = 2, nullable = false)
    private BigDecimal totalBudget;

    @Column(name = "remaining_budget", precision = 18, scale = 2, nullable = false)
    private BigDecimal remainingBudget;

    @Column(name = "min_grant_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal minGrantAmount;

    @Column(name = "max_grant_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal maxGrantAmount;

    @Column(name = "min_eligibility_score", nullable = false)
    private int minEligibilityScore = 60;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<EligibilityCriterion> criteria = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Scheme() {}

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addCriterion(EligibilityCriterion criterion) {
        criteria.add(criterion);
        criterion.setScheme(this);
    }

    public void removeCriterion(EligibilityCriterion criterion) {
        criteria.remove(criterion);
        criterion.setScheme(null);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public BigDecimal getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(BigDecimal remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public BigDecimal getMinGrantAmount() {
        return minGrantAmount;
    }

    public void setMinGrantAmount(BigDecimal minGrantAmount) {
        this.minGrantAmount = minGrantAmount;
    }

    public BigDecimal getMaxGrantAmount() {
        return maxGrantAmount;
    }

    public void setMaxGrantAmount(BigDecimal maxGrantAmount) {
        this.maxGrantAmount = maxGrantAmount;
    }

    public int getMinEligibilityScore() {
        return minEligibilityScore;
    }

    public void setMinEligibilityScore(int minEligibilityScore) {
        this.minEligibilityScore = minEligibilityScore;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<EligibilityCriterion> getCriteria() {
        return criteria;
    }

    public void setCriteria(List<EligibilityCriterion> criteria) {
        this.criteria = criteria;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
