package com.example.governmentsubsidy.dto.scheme;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class SchemeResponse {

    private Long id;
    private String code;
    private String title;
    private String description;
    private String department;
    private BigDecimal totalBudget;
    private BigDecimal remainingBudget;
    private BigDecimal minGrantAmount;
    private BigDecimal maxGrantAmount;
    private int minEligibilityScore;
    private boolean active;
    private List<EligibilityCriterionDto> criteria;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SchemeResponse() {}

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

    public List<EligibilityCriterionDto> getCriteria() {
        return criteria;
    }

    public void setCriteria(List<EligibilityCriterionDto> criteria) {
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
