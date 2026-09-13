package com.example.governmentsubsidy.dto.eligibility;

import com.example.governmentsubsidy.enums.RiskLevel;

import java.util.List;

public class EligibilityEvaluationResult {

    private Long applicationId;
    private String applicationNumber;
    private int totalScore;
    private int minQualifyingScore;
    private boolean eligible;
    private RiskLevel assignedRiskLevel;
    private String recommendation;
    private List<CriterionEvaluationDetail> criteriaDetails;

    public EligibilityEvaluationResult() {}

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public int getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(int totalScore) {
        this.totalScore = totalScore;
    }

    public int getMinQualifyingScore() {
        return minQualifyingScore;
    }

    public void setMinQualifyingScore(int minQualifyingScore) {
        this.minQualifyingScore = minQualifyingScore;
    }

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public RiskLevel getAssignedRiskLevel() {
        return riskLevel();
    }

    public RiskLevel riskLevel() {
        return assignedRiskLevel;
    }

    public void setAssignedRiskLevel(RiskLevel assignedRiskLevel) {
        this.assignedRiskLevel = assignedRiskLevel;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public List<CriterionEvaluationDetail> getCriteriaDetails() {
        return criteriaDetails;
    }

    public void setCriteriaDetails(List<CriterionEvaluationDetail> criteriaDetails) {
        this.criteriaDetails = criteriaDetails;
    }
}
