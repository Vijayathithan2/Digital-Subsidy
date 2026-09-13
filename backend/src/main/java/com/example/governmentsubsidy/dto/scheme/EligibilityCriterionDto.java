package com.example.governmentsubsidy.dto.scheme;

import com.example.governmentsubsidy.enums.ComparisonOperator;
import com.example.governmentsubsidy.enums.CriterionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EligibilityCriterionDto {

    private Long id;

    @NotNull(message = "Criterion type is required")
    private CriterionType criterionType;

    @NotNull(message = "Comparison operator is required")
    private ComparisonOperator comparisonOperator;

    @NotBlank(message = "Expected value is required")
    private String expectedValue;

    private int weightPoints;

    private boolean mandatory;

    private String description;

    public EligibilityCriterionDto() {}

    public EligibilityCriterionDto(CriterionType criterionType, ComparisonOperator comparisonOperator,
                                   String expectedValue, int weightPoints, boolean mandatory, String description) {
        this.criterionType = criterionType;
        this.comparisonOperator = comparisonOperator;
        this.expectedValue = expectedValue;
        this.weightPoints = weightPoints;
        this.mandatory = mandatory;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CriterionType getCriterionType() {
        return criterionType;
    }

    public void setCriterionType(CriterionType criterionType) {
        this.criterionType = criterionType;
    }

    public ComparisonOperator getComparisonOperator() {
        return comparisonOperator;
    }

    public void setComparisonOperator(ComparisonOperator comparisonOperator) {
        this.comparisonOperator = comparisonOperator;
    }

    public String getExpectedValue() {
        return expectedValue;
    }

    public void setExpectedValue(String expectedValue) {
        this.expectedValue = expectedValue;
    }

    public int getWeightPoints() {
        return weightPoints;
    }

    public void setWeightPoints(int weightPoints) {
        this.weightPoints = weightPoints;
    }

    public boolean isMandatory() {
        return mandatory;
    }

    public void setMandatory(boolean mandatory) {
        this.mandatory = mandatory;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
