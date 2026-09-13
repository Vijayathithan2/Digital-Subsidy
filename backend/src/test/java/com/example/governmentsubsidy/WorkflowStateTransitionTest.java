package com.example.governmentsubsidy;

import com.example.governmentsubsidy.dto.verification.VerificationRequest;
import com.example.governmentsubsidy.dto.verification.VerificationResponse;
import com.example.governmentsubsidy.entity.*;
import com.example.governmentsubsidy.enums.*;
import com.example.governmentsubsidy.exception.InvalidStatusTransitionException;
import com.example.governmentsubsidy.repository.*;
import com.example.governmentsubsidy.service.ApplicationService;
import com.example.governmentsubsidy.service.VerificationWorkflowService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class WorkflowStateTransitionTest {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private VerificationWorkflowService workflowService;

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
    private User officer;

    @BeforeEach
    void setUp() {
        officer = userRepository.findByUsername("field_officer1")
                .orElseThrow(() -> new RuntimeException("Seeded officer not found"));

        Beneficiary beneficiary = beneficiaryRepository.findAll().get(0);
        Scheme scheme = schemeRepository.findAll().get(0);
        Region region = regionRepository.findAll().get(0);

        testApp = new SubsidyApplication();
        testApp.setApplicationNumber("SUB-WF-TEST-" + System.currentTimeMillis());
        testApp.setBeneficiary(beneficiary);
        testApp.setScheme(scheme);
        testApp.setRegion(region);
        testApp.setAppliedAmount(new BigDecimal("100000.00"));
        testApp.setStatus(ApplicationStatus.DRAFT);
        testApp = applicationRepository.save(testApp);
    }

    @Test
    @DisplayName("Complete valid workflow from DRAFT to FINANCE_APPROVAL")
    void testEndToEndApprovalWorkflow() {
        // 1. Submit application: DRAFT -> SUBMITTED
        applicationService.submitApplication(testApp.getId(), "beneficiary");
        testApp = applicationRepository.findById(testApp.getId()).get();
        assertEquals(ApplicationStatus.SUBMITTED, testApp.getStatus());

        // 2. Evaluate eligibility: SUBMITTED -> FIELD_VERIFICATION
        applicationService.evaluateEligibility(testApp.getId(), "system");
        testApp = applicationRepository.findById(testApp.getId()).get();
        assertEquals(ApplicationStatus.FIELD_VERIFICATION, testApp.getStatus());

        // 3. Field verification: FIELD_VERIFICATION -> DISTRICT_REVIEW
        VerificationRequest fieldReq = new VerificationRequest(VerificationDecision.APPROVED, "Field visit confirmed");
        VerificationResponse fieldRes = workflowService.performFieldVerification(testApp.getId(), fieldReq, officer);
        assertEquals(ApplicationStatus.DISTRICT_REVIEW, fieldRes.getResultingStatus());

        // 4. District review: DISTRICT_REVIEW -> FINANCE_APPROVAL
        VerificationRequest distReq = new VerificationRequest(VerificationDecision.APPROVED, "District level approval granted");
        VerificationResponse distRes = workflowService.performDistrictReview(testApp.getId(), distReq, officer);
        assertEquals(ApplicationStatus.FINANCE_APPROVAL, distRes.getResultingStatus());

        // 5. Finance approval: FINANCE_APPROVAL -> DISBURSEMENT_PLANNED
        VerificationRequest finReq = new VerificationRequest(VerificationDecision.APPROVED, "Funds sanctioned");
        VerificationResponse finRes = workflowService.performFinanceApproval(testApp.getId(), new BigDecimal("100000.00"), finReq, officer);
        assertEquals(ApplicationStatus.DISBURSEMENT_PLANNED, finRes.getResultingStatus());
    }

    @Test
    @DisplayName("Rejecting invalid transition: Attempting finance approval on FIELD_VERIFICATION throws exception")
    void testInvalidTransitionThrowsException() {
        testApp.setStatus(ApplicationStatus.FIELD_VERIFICATION);
        applicationRepository.save(testApp);

        VerificationRequest finReq = new VerificationRequest(VerificationDecision.APPROVED, "Illegal early approval");

        assertThrows(InvalidStatusTransitionException.class, () ->
                workflowService.performFinanceApproval(testApp.getId(), new BigDecimal("100000.00"), finReq, officer)
        );
    }

    @Test
    @DisplayName("Rejection in field verification transitions status to REJECTED")
    void testFieldRejection() {
        testApp.setStatus(ApplicationStatus.FIELD_VERIFICATION);
        applicationRepository.save(testApp);

        VerificationRequest fieldReq = new VerificationRequest(VerificationDecision.REJECTED, "Land boundaries do not match records");
        VerificationResponse res = workflowService.performFieldVerification(testApp.getId(), fieldReq, officer);

        assertEquals(ApplicationStatus.REJECTED, res.getResultingStatus());
        SubsidyApplication updated = applicationRepository.findById(testApp.getId()).get();
        assertEquals(ApplicationStatus.REJECTED, updated.getStatus());
        assertTrue(updated.getRejectionReason().contains("Field Verification Failed"));
    }

    @Test
    @DisplayName("Requesting reverification transitions status to REVERIFICATION_REQUIRED")
    void testRequestReverification() {
        testApp.setStatus(ApplicationStatus.FIELD_VERIFICATION);
        applicationRepository.save(testApp);

        VerificationRequest fieldReq = new VerificationRequest(VerificationDecision.REVERIFICATION_REQUESTED, "Missing updated revenue extract");
        VerificationResponse res = workflowService.performFieldVerification(testApp.getId(), fieldReq, officer);

        assertEquals(ApplicationStatus.REVERIFICATION_REQUIRED, res.getResultingStatus());
    }
}
