package com.example.governmentsubsidy.dto.analytics;

import java.math.BigDecimal;

public class SchemeAnalyticsDto {

    private Long schemeId;
    private String schemeCode;
    private String schemeTitle;
    private String department;
    private BigDecimal totalBudget;
    private BigDecimal remainingBudget;
    private BigDecimal approvedFunds;
    private BigDecimal releasedFunds;
    private BigDecimal utilizedFunds;
    private long totalApplications;
    private double budgetExhaustionPercentage;

    public SchemeAnalyticsDto() {}

    public Long getSchemeId() {
        return schemeId;
    }

    public void setSchemeId(Long schemeId) {
        this.schemeId = schemeId;
    }

    public String getSchemeCode() {
        return schemeCode;
    }

    public void setSchemeCode(String schemeCode) {
        this.schemeCode = schemeCode;
    }

    public String getSchemeTitle() {
        return schemeTitle;
    }

    public void setSchemeTitle(String schemeTitle) {
        this.schemeTitle = schemeTitle;
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

    public BigDecimal getApprovedFunds() {
        return approvedFunds;
    }

    public void setApprovedFunds(BigDecimal approvedFunds) {
        this.approvedFunds = approvedFunds;
    }

    public BigDecimal getReleasedFunds() {
        return releasedFunds;
    }

    public void setReleasedFunds(BigDecimal releasedFunds) {
        this.releasedFunds = releasedFunds;
    }

    public BigDecimal getUtilizedFunds() {
        return utilizedFunds;
    }

    public void setUtilizedFunds(BigDecimal utilizedFunds) {
        this.utilizedFunds = utilizedFunds;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public double getBudgetExhaustionPercentage() {
        return budgetExhaustionPercentage;
    }

    public void setBudgetExhaustionPercentage(double budgetExhaustionPercentage) {
        this.budgetExhaustionPercentage = budgetExhaustionPercentage;
    }
}
