package com.example.governmentsubsidy;

import com.example.governmentsubsidy.dto.eligibility.EligibilityEvaluationResult;
import com.example.governmentsubsidy.entity.*;
import com.example.governmentsubsidy.enums.BeneficiaryCategory;
import com.example.governmentsubsidy.enums.ComparisonOperator;
import com.example.governmentsubsidy.enums.CriterionType;
import com.example.governmentsubsidy.enums.RiskLevel;
import com.example.governmentsubsidy.service.EligibilityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class EligibilityServiceTest {

    private EligibilityService eligibilityService;
    private Scheme scheme;
    private Beneficiary beneficiary;
    private SubsidyApplication application;

    @BeforeEach
    void setUp() {
        eligibilityService = new EligibilityService();

        scheme = new Scheme();
        scheme.setId(1L);
        scheme.setCode("SCH-TEST");
        scheme.setTitle("Agriculture Test Scheme");
        scheme.setMinEligibilityScore(60);
        scheme.setMinGrantAmount(new BigDecimal("10000.00"));
        scheme.setMaxGrantAmount(new BigDecimal("200000.00"));

        // Mandatory criterion: Income <= 250,000 (40 points)
        scheme.addCriterion(new EligibilityCriterion(
                scheme, CriterionType.ANNUAL_INCOME, ComparisonOperator.LESS_THAN_OR_EQUAL, "250000", 40, true, "Income requirement"
        ));
        // Mandatory criterion: Land <= 2.0 hectares (40 points)
        scheme.addCriterion(new EligibilityCriterion(
                scheme, CriterionType.LAND_HOLDING, ComparisonOperator.LESS_THAN_OR_EQUAL, "2.0", 40, true, "Land limit"
        ));
        // Optional criterion: Category IN OBC,SC,ST,EWS (20 points)
        scheme.addCriterion(new EligibilityCriterion(
                scheme, CriterionType.BENEFICIARY_CATEGORY, ComparisonOperator.IN, "OBC,SC,ST,EWS", 20, false, "Category priority"
        ));

        beneficiary = new Beneficiary();
        beneficiary.setId(1L);
        beneficiary.setCategory(BeneficiaryCategory.OBC);
        beneficiary.setDateOfBirth(LocalDate.of(1990, 1, 1));
        beneficiary.setAnnualIncome(new BigDecimal("180000.00"));
        beneficiary.setLandHoldingHectares(new BigDecimal("1.50"));

        application = new SubsidyApplication();
        application.setId(1L);
        application.setApplicationNumber("SUB-TEST-001");
        application.setBeneficiary(beneficiary);
        application.setScheme(scheme);
        application.setAppliedAmount(new BigDecimal("80000.00"));
    }

    @Test
    @DisplayName("Eligible applicant satisfying all mandatory criteria and score >= 60")
    void testEligibleApplicant() {
        EligibilityEvaluationResult result = eligibilityService.evaluate(application);

        assertTrue(result.isEligible());
        assertEquals(100, result.getTotalScore());
        assertEquals(RiskLevel.LOW, result.getAssignedRiskLevel());
    }

    @Test
    @DisplayName("Applicant with income exceeding mandatory threshold is marked ineligible")
    void testIneligibleDueToExcessIncome() {
        beneficiary.setAnnualIncome(new BigDecimal("350000.00"));

        EligibilityEvaluationResult result = eligibilityService.evaluate(application);

        assertFalse(result.isEligible());
        assertEquals(60, result.getTotalScore()); // Land (40) + Category (20) = 60, but mandatory income failed
        assertTrue(result.getRecommendation().contains("Ineligible"));
    }

    @Test
    @DisplayName("Applicant requesting >= 500,000 triggers HIGH_VALUE risk escalation")
    void testHighValueRiskEscalation() {
        application.setAppliedAmount(new BigDecimal("600000.00"));

        EligibilityEvaluationResult result = eligibilityService.evaluate(application);

        assertTrue(result.isEligible());
        assertEquals(RiskLevel.HIGH_VALUE, result.getAssignedRiskLevel());
    }

    @Test
    @DisplayName("Applicant with borderline score triggers FLAGGED risk for additional scrutiny")
    void testBorderlineScoreTriggersFlaggedRisk() {
        // GENERAL category doesn't get 20 points, total = 80. If minScore = 75, 80 < 85 -> FLAGGED
        scheme.setMinEligibilityScore(75);
        beneficiary.setCategory(BeneficiaryCategory.GENERAL);

        EligibilityEvaluationResult result = eligibilityService.evaluate(application);

        assertTrue(result.isEligible());
        assertEquals(80, result.getTotalScore());
        assertEquals(RiskLevel.FLAGGED, result.getAssignedRiskLevel());
    }
}
