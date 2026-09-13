package com.example.governmentsubsidy.dto.analytics;

import java.math.BigDecimal;

public class RegionAnalyticsDto {

    private Long regionId;
    private String regionCode;
    private String stateName;
    private String districtName;
    private BigDecimal allocatedBudget;
    private BigDecimal utilizedBudget;
    private BigDecimal approvedFunds;
    private BigDecimal releasedFunds;
    private long totalApplications;
    private double budgetUtilizationRate;

    public RegionAnalyticsDto() {}

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public String getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public BigDecimal getAllocatedBudget() {
        return allocatedBudget;
    }

    public void setAllocatedBudget(BigDecimal allocatedBudget) {
        this.allocatedBudget = allocatedBudget;
    }

    public BigDecimal getUtilizedBudget() {
        return utilizedBudget;
    }

    public void setUtilizedBudget(BigDecimal utilizedBudget) {
        this.utilizedBudget = utilizedBudget;
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

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public double getBudgetUtilizationRate() {
        return budgetUtilizationRate;
    }

    public void setBudgetUtilizationRate(double budgetUtilizationRate) {
        this.budgetUtilizationRate = budgetUtilizationRate;
    }
}
