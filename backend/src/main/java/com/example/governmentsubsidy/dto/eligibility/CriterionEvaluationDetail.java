package com.example.governmentsubsidy.dto.eligibility;

import com.example.governmentsubsidy.enums.ComparisonOperator;
import com.example.governmentsubsidy.enums.CriterionType;

public class CriterionEvaluationDetail {

    private CriterionType criterionType;
    private ComparisonOperator operator;
    private String expectedValue;
    private String actualValue;
    private boolean satisfied;
    private boolean mandatory;
    private int weightPointsAwarded;
    private int maxWeightPoints;
    private String message;

    public CriterionEvaluationDetail() {}

    public CriterionEvaluationDetail(CriterionType criterionType, ComparisonOperator operator,
                                     String expectedValue, String actualValue, boolean satisfied,
                                     boolean mandatory, int weightPointsAwarded, int maxWeightPoints,
                                     String message) {
        this.criterionType = criterionType;
        this.operator = operator;
        this.expectedValue = expectedValue;
        this.actualValue = actualValue;
        this.satisfied = satisfied;
        this.mandatory = mandatory;
        this.weightPointsAwarded = weightPointsAwarded;
        this.maxWeightPoints = maxWeightPoints;
        this.message = message;
    }

    public CriterionType getCriterionType() {
        return criterionType;
    }

    public void setCriterionType(CriterionType criterionType) {
        this.criterionType = criterionType;
    }

    public ComparisonOperator getOperator() {
        return operator;
    }

    public void setOperator(ComparisonOperator operator) {
        this.operator = operator;
    }

    public String getExpectedValue() {
        return expectedValue;
    }

    public void setExpectedValue(String expectedValue) {
        this.expectedValue = expectedValue;
    }

    public String getActualValue() {
        return actualValue;
    }

    public void setActualValue(String actualValue) {
        this.actualValue = actualValue;
    }

    public boolean isSatisfied() {
        return satisfied;
    }

    public void setSatisfied(boolean satisfied) {
        this.satisfied = satisfied;
    }

    public boolean isMandatory() {
        return mandatory;
    }

    public void setMandatory(boolean mandatory) {
        this.mandatory = mandatory;
    }

    public int getWeightPointsAwarded() {
        return weightPointsAwarded;
    }

    public void setWeightPointsAwarded(int weightPointsAwarded) {
        this.weightPointsAwarded = weightPointsAwarded;
    }

    public int getMaxWeightPoints() {
        return maxWeightPoints;
    }

    public void setMaxWeightPoints(int maxWeightPoints) {
        this.maxWeightPoints = maxWeightPoints;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
