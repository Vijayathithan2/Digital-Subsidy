package com.example.governmentsubsidy.dto.scheme;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class SchemeRequest {

    @NotBlank(message = "Scheme code is required")
    private String code;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Department is required")
    private String department;

    @NotNull(message = "Total budget is required")
    @DecimalMin(value = "0.01", message = "Total budget must be positive")
    private BigDecimal totalBudget;

    @NotNull(message = "Min grant amount is required")
    @DecimalMin(value = "0.01", message = "Min grant must be positive")
    private BigDecimal minGrantAmount;

    @NotNull(message = "Max grant amount is required")
    @DecimalMin(value = "0.01", message = "Max grant must be positive")
    private BigDecimal maxGrantAmount;

    private int minEligibilityScore = 60;

    private boolean active = true;

    @Valid
    private List<EligibilityCriterionDto> criteria;

    public SchemeRequest() {}

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
}
