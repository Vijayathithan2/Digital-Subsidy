package com.example.governmentsubsidy;

import com.example.governmentsubsidy.dto.disbursement.DisbursementPlanRequest;
import com.example.governmentsubsidy.dto.disbursement.DisbursementPlanResponse;
import com.example.governmentsubsidy.dto.disbursement.FundReleaseRequest;
import com.example.governmentsubsidy.dto.disbursement.FundReleaseResponse;
import com.example.governmentsubsidy.dto.milestone.MilestoneRequest;
import com.example.governmentsubsidy.entity.*;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.MilestoneReleaseStatus;
import com.example.governmentsubsidy.enums.MilestoneType;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.exception.ComplianceViolationException;
import com.example.governmentsubsidy.repository.*;
import com.example.governmentsubsidy.service.DisbursementService;
import com.example.governmentsubsidy.service.MilestoneService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DisbursementAndComplianceTest {

    @Autowired
    private DisbursementService disbursementService;

    @Autowired
    private MilestoneService milestoneService;

    @Autowired
    private SubsidyApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private RegionRepository regionRepository;

    private SubsidyApplication testApp;
    private User financeOfficer;

    @BeforeEach
    void setUp() {
        financeOfficer = userRepository.findByUsername("finance_officer1")
                .orElseThrow(() -> new RuntimeException("Seeded finance officer not found"));

        Beneficiary beneficiary = beneficiaryRepository.findAll().get(0);
        Scheme scheme = schemeRepository.findAll().get(0);
        Region region = regionRepository.findAll().get(0);

        testApp = new SubsidyApplication();
        testApp.setApplicationNumber("SUB-DISB-TEST-" + System.currentTimeMillis());
        testApp.setBeneficiary(beneficiary);
        testApp.setScheme(scheme);
        testApp.setRegion(region);
        testApp.setAppliedAmount(new BigDecimal("100000.00"));
        testApp.setApprovedAmount(new BigDecimal("100000.00"));
        testApp.setStatus(ApplicationStatus.DISBURSEMENT_PLANNED);
        testApp = applicationRepository.save(testApp);
    }

    @Test
    @DisplayName("Create valid 2-stage disbursement plan matching approved amount")
    void testCreateDisbursementPlan() {
        DisbursementPlanRequest planReq = new DisbursementPlanRequest();
        planReq.setApplicationId(testApp.getId());
        planReq.setTotalPlannedAmount(new BigDecimal("100000.00"));
        planReq.setMilestones(List.of(
                new MilestoneRequest(1, "Milestone 1 - Initial", MilestoneType.DOCUMENTATION, new BigDecimal("60000.00"), LocalDate.now().plusDays(15), "Documents verified"),
                new MilestoneRequest(2, "Milestone 2 - Completion", MilestoneType.FINAL_COMPLETION, new BigDecimal("40000.00"), LocalDate.now().plusDays(45), "Work verified")
        ));

        DisbursementPlanResponse planRes = disbursementService.createDisbursementPlan(planReq, "finance_officer1");

        assertNotNull(planRes.getId());
        assertEquals(2, planRes.getMilestones().size());
        assertEquals(new BigDecimal("100000.00"), planRes.getTotalPlannedAmount());

        SubsidyApplication updatedApp = applicationRepository.findById(testApp.getId()).get();
        assertEquals(ApplicationStatus.MILESTONE_PENDING, updatedApp.getStatus());
    }

    @Test
    @DisplayName("Prevent disbursement plan creation if milestone sum does not match approved amount")
    void testMilestoneSumMismatchThrowsBadRequest() {
        DisbursementPlanRequest planReq = new DisbursementPlanRequest();
        planReq.setApplicationId(testApp.getId());
        planReq.setTotalPlannedAmount(new BigDecimal("100000.00"));
        // Milestones sum to 80,000 instead of 100,000
        planReq.setMilestones(List.of(
                new MilestoneRequest(1, "Milestone 1", MilestoneType.DOCUMENTATION, new BigDecimal("50000.00"), LocalDate.now().plusDays(15), "Condition 1"),
                new MilestoneRequest(2, "Milestone 2", MilestoneType.FINAL_COMPLETION, new BigDecimal("30000.00"), LocalDate.now().plusDays(45), "Condition 2")
        ));

        assertThrows(BadRequestException.class, () ->
                disbursementService.createDisbursementPlan(planReq, "finance_officer1")
        );
    }

    @Test
    @DisplayName("Prevent fund release when compliance condition is not satisfied")
    void testReleaseWithoutComplianceThrowsException() {
        DisbursementPlanRequest planReq = new DisbursementPlanRequest();
        planReq.setApplicationId(testApp.getId());
        planReq.setTotalPlannedAmount(new BigDecimal("100000.00"));
        planReq.setMilestones(List.of(
                new MilestoneRequest(1, "M1", MilestoneType.DOCUMENTATION, new BigDecimal("100000.00"), LocalDate.now().plusDays(15), "Physical invoice submission")
        ));
        DisbursementPlanResponse planRes = disbursementService.createDisbursementPlan(planReq, "finance_officer1");
        Long milestoneId = planRes.getMilestones().get(0).getId();

        FundReleaseRequest releaseReq = new FundReleaseRequest(new BigDecimal("100000.00"), "DIRECT_BENEFIT_TRANSFER", "First payment");

        assertThrows(ComplianceViolationException.class, () ->
                disbursementService.releaseMilestoneFunds(milestoneId, releaseReq, financeOfficer)
        );
    }

    @Test
    @DisplayName("Successful compliance verification enables fund release and updates application to FULLY_DISBURSED")
    void testSuccessfulComplianceAndRelease() {
        DisbursementPlanRequest planReq = new DisbursementPlanRequest();
        planReq.setApplicationId(testApp.getId());
        planReq.setTotalPlannedAmount(new BigDecimal("100000.00"));
        planReq.setMilestones(List.of(
                new MilestoneRequest(1, "Full Sanction", MilestoneType.DOCUMENTATION, new BigDecimal("100000.00"), LocalDate.now().plusDays(15), "ID and Land Check")
        ));
        DisbursementPlanResponse planRes = disbursementService.createDisbursementPlan(planReq, "finance_officer1");
        Long milestoneId = planRes.getMilestones().get(0).getId();

        // 1. Mark compliance satisfied
        milestoneService.markComplianceSatisfied(milestoneId, "Inspection completed and verified", "field_officer1");

        // 2. Release funds
        FundReleaseRequest releaseReq = new FundReleaseRequest(new BigDecimal("100000.00"), "DIRECT_BENEFIT_TRANSFER", "DBT release");
        FundReleaseResponse releaseRes = disbursementService.releaseMilestoneFunds(milestoneId, releaseReq, financeOfficer);

        assertNotNull(releaseRes.getTransactionRefNumber());
        assertTrue(releaseRes.getTransactionRefNumber().startsWith("SBIN"));
        assertEquals(new BigDecimal("100000.00"), releaseRes.getReleasedAmount());

        SubsidyApplication updatedApp = applicationRepository.findById(testApp.getId()).get();
        assertEquals(ApplicationStatus.FULLY_DISBURSED, updatedApp.getStatus());
    }
}
