package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.disbursement.*;
import com.example.governmentsubsidy.dto.milestone.MilestoneRequest;
import com.example.governmentsubsidy.entity.*;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.MilestoneReleaseStatus;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.exception.ComplianceViolationException;
import com.example.governmentsubsidy.exception.InvalidStatusTransitionException;
import com.example.governmentsubsidy.exception.ResourceNotFoundException;
import com.example.governmentsubsidy.repository.DisbursementPlanRepository;
import com.example.governmentsubsidy.repository.FundReleaseRepository;
import com.example.governmentsubsidy.repository.SubsidyApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisbursementService {

    private final DisbursementPlanRepository planRepository;
    private final FundReleaseRepository fundReleaseRepository;
    private final SubsidyApplicationRepository applicationRepository;
    private final ApplicationService applicationService;
    private final MilestoneService milestoneService;
    private final SchemeService schemeService;
    private final RegionService regionService;
    private final TreasuryIntegrationService treasuryService;
    private final AuditLogService auditLogService;

    public DisbursementService(DisbursementPlanRepository planRepository,
                               FundReleaseRepository fundReleaseRepository,
                               SubsidyApplicationRepository applicationRepository,
                               ApplicationService applicationService,
                               MilestoneService milestoneService,
                               SchemeService schemeService,
                               RegionService regionService,
                               TreasuryIntegrationService treasuryService,
                               AuditLogService auditLogService) {
        this.planRepository = planRepository;
        this.fundReleaseRepository = fundReleaseRepository;
        this.applicationRepository = applicationRepository;
        this.applicationService = applicationService;
        this.milestoneService = milestoneService;
        this.schemeService = schemeService;
        this.regionService = regionService;
        this.treasuryService = treasuryService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public DisbursementPlanResponse createDisbursementPlan(DisbursementPlanRequest request, String actingUser) {
        SubsidyApplication app = applicationService.getApplicationEntity(request.getApplicationId());

        if (app.getStatus() != ApplicationStatus.DISBURSEMENT_PLANNED) {
            throw new InvalidStatusTransitionException(
                    "Disbursement plan can only be created when application is in DISBURSEMENT_PLANNED status. Current: " + app.getStatus()
            );
        }

        if (planRepository.existsByApplicationId(app.getId())) {
            throw new BadRequestException("Disbursement plan already exists for this application");
        }

        BigDecimal milestoneTotal = request.getMilestones().stream()
                .map(MilestoneRequest::getScheduledAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (milestoneTotal.compareTo(app.getApprovedAmount()) != 0) {
            throw new BadRequestException(
                    "Sum of milestone amounts (" + milestoneTotal + ") must exactly match the approved grant amount (" + app.getApprovedAmount() + ")"
            );
        }

        DisbursementPlan plan = new DisbursementPlan(app, app.getApprovedAmount());

        int seq = 1;
        for (MilestoneRequest mReq : request.getMilestones()) {
            DisbursementMilestone milestone = new DisbursementMilestone(
                    plan,
                    mReq.getSequenceNumber() > 0 ? mReq.getSequenceNumber() : seq++,
                    mReq.getTitle(),
                    mReq.getMilestoneType(),
                    mReq.getScheduledAmount(),
                    mReq.getDueDate(),
                    mReq.getComplianceCondition()
            );
            plan.addMilestone(milestone);
        }

        DisbursementPlan savedPlan = planRepository.save(plan);

        // Update application status
        app.setStatus(ApplicationStatus.MILESTONE_PENDING);
        app.setDisbursementPlan(savedPlan);
        applicationRepository.save(app);

        auditLogService.logAction(
                actingUser,
                "DISBURSEMENT_PLAN_CREATED",
                "DisbursementPlan",
                savedPlan.getId().toString(),
                ApplicationStatus.DISBURSEMENT_PLANNED.name(),
                ApplicationStatus.MILESTONE_PENDING.name(),
                "Plan created with " + plan.getMilestones().size() + " milestones for total amount: " + plan.getTotalPlannedAmount()
        );

        return mapToResponse(savedPlan);
    }

    @Transactional
    public FundReleaseResponse releaseMilestoneFunds(Long milestoneId, FundReleaseRequest request, User financeOfficer) {
        DisbursementMilestone milestone = milestoneService.getMilestoneEntity(milestoneId);
        DisbursementPlan plan = milestone.getPlan();
        SubsidyApplication app = plan.getApplication();

        if (milestone.getReleaseStatus() == MilestoneReleaseStatus.RELEASED) {
            throw new BadRequestException("Funds have already been released for milestone: " + milestone.getTitle());
        }

        if (!milestone.isComplianceSatisfied()) {
            throw new ComplianceViolationException(
                    "Cannot release funds: required compliance condition [" + milestone.getComplianceCondition() + "] has not been satisfied."
            );
        }

        BigDecimal releaseAmount = request.getAmount() != null ? request.getAmount() : milestone.getScheduledAmount();

        if (releaseAmount.compareTo(milestone.getScheduledAmount()) > 0) {
            throw new BadRequestException(
                    "Release amount (" + releaseAmount + ") exceeds scheduled milestone amount (" + milestone.getScheduledAmount() + ")"
            );
        }

        if (releaseAmount.compareTo(plan.getTotalRemainingAmount()) > 0) {
            throw new BadRequestException(
                    "Release amount (" + releaseAmount + ") exceeds plan remaining amount (" + plan.getTotalRemainingAmount() + ")"
            );
        }

        // Deduct from scheme budget and record regional expenditure
        schemeService.deductSchemeBudget(app.getScheme().getId(), releaseAmount);
        regionService.recordRegionalFundDisbursement(app.getRegion().getId(), releaseAmount);

        // Process through Treasury Interface
        TreasuryIntegrationService.TreasuryDisbursementResult treasuryResult = treasuryService.processTreasuryTransfer(
                app.getBeneficiary().getBankAccountNumber(),
                app.getBeneficiary().getBankIfscCode(),
                releaseAmount,
                app.getScheme().getCode()
        );

        // Create FundRelease record
        FundRelease fundRelease = new FundRelease(
                milestone,
                treasuryResult.transactionReference(),
                releaseAmount,
                financeOfficer,
                request.getPaymentMode() != null ? request.getPaymentMode() : "DIRECT_BENEFIT_TRANSFER",
                treasuryResult.status()
        );
        FundRelease savedRelease = fundReleaseRepository.save(fundRelease);

        // Update Milestone
        milestone.setReleaseStatus(MilestoneReleaseStatus.RELEASED);
        milestone.setCompletedAt(java.time.LocalDateTime.now());
        milestone.setFundRelease(savedRelease);

        // Update Plan
        plan.setTotalReleasedAmount(plan.getTotalReleasedAmount().add(releaseAmount));
        plan.setTotalRemainingAmount(plan.getTotalRemainingAmount().subtract(releaseAmount));
        planRepository.save(plan);

        // Evaluate and update application status
        boolean allMilestonesReleased = plan.getMilestones().stream()
                .allMatch(m -> m.getReleaseStatus() == MilestoneReleaseStatus.RELEASED);

        ApplicationStatus previousStatus = app.getStatus();
        ApplicationStatus newStatus = allMilestonesReleased ? ApplicationStatus.FULLY_DISBURSED : ApplicationStatus.DISBURSEMENT_IN_PROGRESS;

        app.setStatus(newStatus);
        applicationRepository.save(app);

        auditLogService.logAction(
                financeOfficer.getUsername(),
                "FUND_RELEASED",
                "FundRelease",
                savedRelease.getId().toString(),
                previousStatus.name(),
                newStatus.name(),
                "Released " + releaseAmount + " for milestone " + milestone.getTitle() + ". UTR: " + savedRelease.getTransactionRefNumber()
        );

        FundReleaseResponse res = new FundReleaseResponse();
        res.setId(savedRelease.getId());
        res.setMilestoneId(milestone.getId());
        res.setMilestoneSequence(milestone.getSequenceNumber());
        res.setMilestoneTitle(milestone.getTitle());
        res.setTransactionRefNumber(savedRelease.getTransactionRefNumber());
        res.setReleasedAmount(savedRelease.getReleasedAmount());
        res.setReleasedByUserId(financeOfficer.getId());
        res.setReleasedByUsername(financeOfficer.getUsername());
        res.setPaymentMode(savedRelease.getPaymentMode());
        res.setTreasuryStatus(savedRelease.getTreasuryStatus());
        res.setReleasedAt(savedRelease.getReleasedAt());
        return res;
    }

    @Transactional(readOnly = true)
    public DisbursementPlanResponse getPlanByApplicationId(Long applicationId) {
        DisbursementPlan plan = planRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("No disbursement plan found for application ID: " + applicationId));
        return mapToResponse(plan);
    }

    public DisbursementPlanResponse mapToResponse(DisbursementPlan p) {
        DisbursementPlanResponse res = new DisbursementPlanResponse();
        res.setId(p.getId());
        res.setApplicationId(p.getApplication().getId());
        res.setApplicationNumber(p.getApplication().getApplicationNumber());
        res.setTotalPlannedAmount(p.getTotalPlannedAmount());
        res.setTotalReleasedAmount(p.getTotalReleasedAmount());
        res.setTotalRemainingAmount(p.getTotalRemainingAmount());
        res.setStatus(p.getStatus());
        res.setCreatedAt(p.getCreatedAt());

        if (p.getMilestones() != null) {
            res.setMilestones(p.getMilestones().stream()
                    .map(milestoneService::mapToResponse)
                    .collect(Collectors.toList()));
        } else {
            res.setMilestones(new ArrayList<>());
        }
        return res;
    }
}
