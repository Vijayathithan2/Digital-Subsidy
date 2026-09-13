package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.eligibility.CriterionEvaluationDetail;
import com.example.governmentsubsidy.dto.eligibility.EligibilityEvaluationResult;
import com.example.governmentsubsidy.entity.Beneficiary;
import com.example.governmentsubsidy.entity.EligibilityCriterion;
import com.example.governmentsubsidy.entity.Scheme;
import com.example.governmentsubsidy.entity.SubsidyApplication;
import com.example.governmentsubsidy.enums.ComparisonOperator;
import com.example.governmentsubsidy.enums.RiskLevel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class EligibilityService {

    public EligibilityEvaluationResult evaluate(SubsidyApplication application) {
        Beneficiary beneficiary = application.getBeneficiary();
        Scheme scheme = application.getScheme();

        List<EligibilityCriterion> criteria = scheme.getCriteria();
        List<CriterionEvaluationDetail> details = new ArrayList<>();

        int totalAwardedPoints = 0;
        boolean allMandatorySatisfied = true;

        if (criteria == null || criteria.isEmpty()) {
            // Default pass if no custom criteria configured
            EligibilityEvaluationResult result = new EligibilityEvaluationResult();
            result.setApplicationId(application.getId());
            result.setApplicationNumber(application.getApplicationNumber());
            result.setTotalScore(100);
            result.setMinQualifyingScore(scheme.getMinEligibilityScore());
            result.setEligible(true);
            result.setAssignedRiskLevel(determineRiskLevel(application.getAppliedAmount(), 100, scheme.getMinEligibilityScore()));
            result.setRecommendation("Eligible - Standard criteria applied");
            result.setCriteriaDetails(details);
            return result;
        }

        for (EligibilityCriterion criterion : criteria) {
            String actualValue = resolveActualValue(beneficiary, criterion);
            boolean satisfied = evaluateCondition(actualValue, criterion.getComparisonOperator(), criterion.getExpectedValue());

            int awardedPoints = 0;
            if (satisfied) {
                awardedPoints = criterion.getWeightPoints();
                totalAwardedPoints += awardedPoints;
            } else if (criterion.isMandatory()) {
                allMandatorySatisfied = false;
            }

            String msg = satisfied ? "Condition satisfied" : (criterion.isMandatory() ? "Mandatory requirement failed" : "Condition not satisfied");

            CriterionEvaluationDetail detail = new CriterionEvaluationDetail(
                    criterion.getCriterionType(),
                    criterion.getComparisonOperator(),
                    criterion.getExpectedValue(),
                    actualValue,
                    satisfied,
                    criterion.isMandatory(),
                    awardedPoints,
                    criterion.getWeightPoints(),
                    msg
            );
            details.add(detail);
        }

        boolean isEligible = allMandatorySatisfied && (totalAwardedPoints >= scheme.getMinEligibilityScore());
        RiskLevel riskLevel = determineRiskLevel(application.getAppliedAmount(), totalAwardedPoints, scheme.getMinEligibilityScore());

        EligibilityEvaluationResult result = new EligibilityEvaluationResult();
        result.setApplicationId(application.getId());
        result.setApplicationNumber(application.getApplicationNumber());
        result.setTotalScore(totalAwardedPoints);
        result.setMinQualifyingScore(scheme.getMinEligibilityScore());
        result.setEligible(isEligible);
        result.setAssignedRiskLevel(riskLevel);
        result.setCriteriaDetails(details);

        if (!allMandatorySatisfied) {
            result.setRecommendation("Ineligible - One or more mandatory scheme conditions were not satisfied.");
        } else if (totalAwardedPoints < scheme.getMinEligibilityScore()) {
            result.setRecommendation("Ineligible - Score (" + totalAwardedPoints + ") is below minimum qualifying score (" + scheme.getMinEligibilityScore() + ").");
        } else if (riskLevel == RiskLevel.HIGH_VALUE) {
            result.setRecommendation("Eligible with Escalation - High grant value requires senior district and finance officer review.");
        } else if (riskLevel == RiskLevel.FLAGGED) {
            result.setRecommendation("Eligible with Scrutiny - Borderline eligibility score requires comprehensive ground verification.");
        } else {
            result.setRecommendation("Eligible - Passed all requirements under standard workflow.");
        }

        return result;
    }

    private String resolveActualValue(Beneficiary b, EligibilityCriterion c) {
        return switch (c.getCriterionType()) {
            case ANNUAL_INCOME -> b.getAnnualIncome() != null ? b.getAnnualIncome().toPlainString() : "0";
            case BENEFICIARY_CATEGORY -> b.getCategory() != null ? b.getCategory().name() : "";
            case AGE -> {
                if (b.getDateOfBirth() == null) yield "0";
                int age = Period.between(b.getDateOfBirth(), LocalDate.now()).getYears();
                yield String.valueOf(age);
            }
            case REGION_CODE -> (b.getRegion() != null && b.getRegion().getCode() != null) ? b.getRegion().getCode() : "";
            case LAND_HOLDING -> b.getLandHoldingHectares() != null ? b.getLandHoldingHectares().toPlainString() : "0";
            case DISABILITY_STATUS -> String.valueOf(b.isDisabled());
        };
    }

    private boolean evaluateCondition(String actual, ComparisonOperator op, String expected) {
        if (actual == null || expected == null) return false;

        try {
            switch (op) {
                case LESS_THAN_OR_EQUAL -> {
                    BigDecimal act = new BigDecimal(actual.trim());
                    BigDecimal exp = new BigDecimal(expected.trim());
                    return act.compareTo(exp) <= 0;
                }
                case GREATER_THAN_OR_EQUAL -> {
                    BigDecimal act = new BigDecimal(actual.trim());
                    BigDecimal exp = new BigDecimal(expected.trim());
                    return act.compareTo(exp) >= 0;
                }
                case EQUALS -> {
                    return actual.trim().equalsIgnoreCase(expected.trim());
                }
                case NOT_EQUALS -> {
                    return !actual.trim().equalsIgnoreCase(expected.trim());
                }
                case IN -> {
                    String[] allowed = expected.split(",");
                    return Arrays.stream(allowed)
                            .map(String::trim)
                            .anyMatch(val -> val.equalsIgnoreCase(actual.trim()));
                }
                case CONTAINS -> {
                    return actual.toLowerCase().contains(expected.trim().toLowerCase());
                }
            }
        } catch (NumberFormatException ignored) {
            // Fall back to string equality if numeric parse fails
            return actual.trim().equalsIgnoreCase(expected.trim());
        }
        return false;
    }

    public RiskLevel determineRiskLevel(BigDecimal appliedAmount, int score, int minScore) {
        BigDecimal highValueThreshold = new BigDecimal("500000.00");
        if (appliedAmount != null && appliedAmount.compareTo(highValueThreshold) >= 0) {
            return RiskLevel.HIGH_VALUE;
        }
        if (score >= minScore && score < (minScore + 10)) {
            return RiskLevel.FLAGGED;
        }
        return RiskLevel.LOW;
    }
}
