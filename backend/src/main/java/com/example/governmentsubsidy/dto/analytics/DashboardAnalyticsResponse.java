package com.example.governmentsubsidy.dto.analytics;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardAnalyticsResponse {

    private long totalSchemes;
    private long activeSchemes;
    private long totalBeneficiaries;
    private long totalApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long pendingApplications;
    private long fullyDisbursedApplications;
    private long completedApplications;

    private BigDecimal totalApprovedFunds;
    private BigDecimal totalReleasedFunds;
    private BigDecimal totalUtilizedFunds;
    private BigDecimal remainingFundsToRelease;
    private BigDecimal remainingFundsToUtilize;
    private double overallUtilizationPercentage;

    private long overdueMilestonesCount;

    private Map<String, Long> categoryDistribution;
    private List<SchemeAnalyticsDto> schemeBreakdown;
    private List<RegionAnalyticsDto> regionBreakdown;

    public DashboardAnalyticsResponse() {}

    public long getTotalSchemes() {
        return totalSchemes;
    }

    public void setTotalSchemes(long totalSchemes) {
        this.totalSchemes = totalSchemes;
    }

    public long getActiveSchemes() {
        return activeSchemes;
    }

    public void setActiveSchemes(long activeSchemes) {
        this.activeSchemes = activeSchemes;
    }

    public long getTotalBeneficiaries() {
        return totalBeneficiaries;
    }

    public void setTotalBeneficiaries(long totalBeneficiaries) {
        this.totalBeneficiaries = totalBeneficiaries;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getApprovedApplications() {
        return approvedApplications;
    }

    public void setApprovedApplications(long approvedApplications) {
        this.approvedApplications = approvedApplications;
    }

    public long getRejectedApplications() {
        return rejectedApplications;
    }

    public void setRejectedApplications(long rejectedApplications) {
        this.rejectedApplications = rejectedApplications;
    }

    public long getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public long getFullyDisbursedApplications() {
        return fullyDisbursedApplications;
    }

    public void setFullyDisbursedApplications(long fullyDisbursedApplications) {
        this.fullyDisbursedApplications = fullyDisbursedApplications;
    }

    public long getCompletedApplications() {
        return completedApplications;
    }

    public void setCompletedApplications(long completedApplications) {
        this.completedApplications = completedApplications;
    }

    public BigDecimal getTotalApprovedFunds() {
        return totalApprovedFunds;
    }

    public void setTotalApprovedFunds(BigDecimal totalApprovedFunds) {
        this.totalApprovedFunds = totalApprovedFunds;
    }

    public BigDecimal getTotalReleasedFunds() {
        return totalReleasedFunds;
    }

    public void setTotalReleasedFunds(BigDecimal totalReleasedFunds) {
        this.totalReleasedFunds = totalReleasedFunds;
    }

    public BigDecimal getTotalUtilizedFunds() {
        return totalUtilizedFunds;
    }

    public void setTotalUtilizedFunds(BigDecimal totalUtilizedFunds) {
        this.totalUtilizedFunds = totalUtilizedFunds;
    }

    public BigDecimal getRemainingFundsToRelease() {
        return remainingFundsToRelease;
    }

    public void setRemainingFundsToRelease(BigDecimal remainingFundsToRelease) {
        this.remainingFundsToRelease = remainingFundsToRelease;
    }

    public BigDecimal getRemainingFundsToUtilize() {
        return remainingFundsToUtilize;
    }

    public void setRemainingFundsToUtilize(BigDecimal remainingFundsToUtilize) {
        this.remainingFundsToUtilize = remainingFundsToUtilize;
    }

    public double getOverallUtilizationPercentage() {
        return overallUtilizationPercentage;
    }

    public void setOverallUtilizationPercentage(double overallUtilizationPercentage) {
        this.overallUtilizationPercentage = overallUtilizationPercentage;
    }

    public long getOverdueMilestonesCount() {
        return overdueMilestonesCount;
    }

    public void setOverdueMilestonesCount(long overdueMilestonesCount) {
        this.overdueMilestonesCount = overdueMilestonesCount;
    }

    public Map<String, Long> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(Map<String, Long> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public List<SchemeAnalyticsDto> getSchemeBreakdown() {
        return schemeBreakdown;
    }

    public void setSchemeBreakdown(List<SchemeAnalyticsDto> schemeBreakdown) {
        this.schemeBreakdown = schemeBreakdown;
    }

    public List<RegionAnalyticsDto> getRegionBreakdown() {
        return regionBreakdown;
    }

    public void setRegionBreakdown(List<RegionAnalyticsDto> regionBreakdown) {
        this.regionBreakdown = regionBreakdown;
    }
}
