package com.example.governmentsubsidy;

import com.example.governmentsubsidy.dto.disbursement.DisbursementPlanRequest;
import com.example.governmentsubsidy.dto.disbursement.DisbursementPlanResponse;
import com.example.governmentsubsidy.dto.disbursement.FundReleaseRequest;
import com.example.governmentsubsidy.dto.milestone.MilestoneRequest;
import com.example.governmentsubsidy.dto.utilization.UtilizationRequest;
import com.example.governmentsubsidy.dto.utilization.UtilizationResponse;
import com.example.governmentsubsidy.entity.*;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.MilestoneType;
import com.example.governmentsubsidy.enums.UtilizationVerificationStatus;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.repository.*;
import com.example.governmentsubsidy.service.DisbursementService;
import com.example.governmentsubsidy.service.FundUtilizationService;
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
class FundUtilizationTest {

    @Autowired
    private FundUtilizationService utilizationService;

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
    private User beneficiaryUser;
    private User officer;

    @BeforeEach
    void setUp() {
        beneficiaryUser = userRepository.findByUsername("farmer_john").get();
        officer = userRepository.findByUsername("field_officer1").get();

        Beneficiary beneficiary = beneficiaryRepository.findByUser(beneficiaryUser).get();
        Scheme scheme = schemeRepository.findAll().get(0);
        Region region = regionRepository.findAll().get(0);

        testApp = new SubsidyApplication();
        testApp.setApplicationNumber("SUB-UTIL-TEST-" + System.currentTimeMillis());
        testApp.setBeneficiary(beneficiary);
        testApp.setScheme(scheme);
        testApp.setRegion(region);
        testApp.setAppliedAmount(new BigDecimal("100000.00"));
        testApp.setApprovedAmount(new BigDecimal("100000.00"));
        testApp.setStatus(ApplicationStatus.DISBURSEMENT_PLANNED);
        testApp = applicationRepository.save(testApp);

        // Create plan and release 100,000
        DisbursementPlanRequest planReq = new DisbursementPlanRequest();
        planReq.setApplicationId(testApp.getId());
        planReq.setTotalPlannedAmount(new BigDecimal("100000.00"));
        planReq.setMilestones(List.of(
                new MilestoneRequest(1, "Sanction", MilestoneType.DOCUMENTATION, new BigDecimal("100000.00"), LocalDate.now().plusDays(10), "Condition")
        ));
        DisbursementPlanResponse planRes = disbursementService.createDisbursementPlan(planReq, "finance_officer1");
        Long milestoneId = planRes.getMilestones().get(0).getId();
        milestoneService.markComplianceSatisfied(milestoneId, "Compliance checked", "field_officer1");

        FundReleaseRequest releaseReq = new FundReleaseRequest(new BigDecimal("100000.00"), "DIRECT_BENEFIT_TRANSFER", "Full release");
        disbursementService.releaseMilestoneFunds(milestoneId, releaseReq, officer);

        testApp = applicationRepository.findById(testApp.getId()).get();
        assertEquals(ApplicationStatus.FULLY_DISBURSED, testApp.getStatus());
    }

    @Test
    @DisplayName("Beneficiary submits fund utilization within released limits")
    void testSubmitUtilization() {
        UtilizationRequest req = new UtilizationRequest(
                new BigDecimal("60000.00"),
                "uploads/documents/equipment_invoice_01.pdf",
                "Purchased solar water pump set"
        );

        UtilizationResponse res = utilizationService.submitUtilization(testApp.getId(), req, beneficiaryUser);

        assertNotNull(res.getId());
        assertEquals(new BigDecimal("60000.00"), res.getUtilizedAmount());
        assertEquals(UtilizationVerificationStatus.PENDING, res.getVerificationStatus());

        SubsidyApplication updatedApp = applicationRepository.findById(testApp.getId()).get();
        assertEquals(ApplicationStatus.UTILIZATION_PENDING, updatedApp.getStatus());
    }

    @Test
    @DisplayName("Prevent submitting utilization exceeding total released amount")
    void testExcessUtilizationThrowsBadRequest() {
        UtilizationRequest req = new UtilizationRequest(
                new BigDecimal("150000.00"), // Exceeds 100,000 released
                "uploads/documents/fake_bill.pdf",
                "Overstated expenditure"
        );

        assertThrows(BadRequestException.class, () ->
                utilizationService.submitUtilization(testApp.getId(), req, beneficiaryUser)
        );
    }

    @Test
    @DisplayName("Verifying 100% fund utilization advances application to COMPLETED")
    void testVerificationTransitionsToCompleted() {
        // Submit full 100,000 utilization
        UtilizationRequest req = new UtilizationRequest(
                new BigDecimal("100000.00"),
                "uploads/documents/complete_invoices.pdf",
                "Full project executed on ground"
        );
        UtilizationResponse res = utilizationService.submitUtilization(testApp.getId(), req, beneficiaryUser);

        // Verify utilization
        utilizationService.verifyUtilization(res.getId(), true, "All invoices and site photos inspected", officer);

        SubsidyApplication finalApp = applicationRepository.findById(testApp.getId()).get();
        assertEquals(ApplicationStatus.COMPLETED, finalApp.getStatus());
    }
}
