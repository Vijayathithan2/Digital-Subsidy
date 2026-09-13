package com.example.governmentsubsidy.entity;

import com.example.governmentsubsidy.enums.ComparisonOperator;
import com.example.governmentsubsidy.enums.CriterionType;
import jakarta.persistence.*;

@Entity
@Table(name = "eligibility_criteria")
public class EligibilityCriterion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Enumerated(EnumType.STRING)
    @Column(name = "criterion_type", length = 50, nullable = false)
    private CriterionType criterionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "comparison_operator", length = 30, nullable = false)
    private ComparisonOperator comparisonOperator;

    @Column(name = "expected_value", length = 100, nullable = false)
    private String expectedValue;

    @Column(name = "weight_points", nullable = false)
    private int weightPoints;

    @Column(name = "is_mandatory", nullable = false)
    private boolean mandatory = false;

    @Column(name = "description", length = 255)
    private String description;

    public EligibilityCriterion() {}

    public EligibilityCriterion(Scheme scheme, CriterionType criterionType, ComparisonOperator comparisonOperator,
                                String expectedValue, int weightPoints, boolean mandatory, String description) {
        this.scheme = scheme;
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

    public Scheme getScheme() {
        return scheme;
    }

    public void setScheme(Scheme scheme) {
        this.scheme = scheme;
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
