package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.utilization.UtilizationRequest;
import com.example.governmentsubsidy.dto.utilization.UtilizationResponse;
import com.example.governmentsubsidy.entity.FundUtilization;
import com.example.governmentsubsidy.entity.SubsidyApplication;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.UtilizationVerificationStatus;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.exception.InvalidStatusTransitionException;
import com.example.governmentsubsidy.exception.ResourceNotFoundException;
import com.example.governmentsubsidy.repository.FundUtilizationRepository;
import com.example.governmentsubsidy.repository.SubsidyApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FundUtilizationService {

    private final FundUtilizationRepository utilizationRepository;
    private final SubsidyApplicationRepository applicationRepository;
    private final ApplicationService applicationService;
    private final AuditLogService auditLogService;

    public FundUtilizationService(FundUtilizationRepository utilizationRepository,
                                  SubsidyApplicationRepository applicationRepository,
                                  ApplicationService applicationService,
                                  AuditLogService auditLogService) {
        this.utilizationRepository = utilizationRepository;
        this.applicationRepository = applicationRepository;
        this.applicationService = applicationService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public UtilizationResponse submitUtilization(Long applicationId, UtilizationRequest request, User beneficiaryUser) {
        SubsidyApplication app = applicationService.getApplicationEntity(applicationId);

        if (app.getStatus() != ApplicationStatus.FULLY_DISBURSED &&
                app.getStatus() != ApplicationStatus.DISBURSEMENT_IN_PROGRESS &&
                app.getStatus() != ApplicationStatus.UTILIZATION_PENDING) {
            throw new InvalidStatusTransitionException(
                    "Utilization can only be submitted for applications in disbursement or utilization stages. Current status: " + app.getStatus()
            );
        }

        BigDecimal totalReleased = (app.getDisbursementPlan() != null) ?
                app.getDisbursementPlan().getTotalReleasedAmount() : BigDecimal.ZERO;

        if (totalReleased.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Cannot submit utilization: no funds have been released yet");
        }

        BigDecimal currentUtilized = utilizationRepository.sumUtilizedByApplicationId(app.getId());
        BigDecimal newCumulative = currentUtilized.add(request.getUtilizedAmount());

        if (newCumulative.compareTo(totalReleased) > 0) {
            throw new BadRequestException(
                    "Total reported utilization (" + newCumulative + ") cannot exceed total released funds (" + totalReleased + ")"
            );
        }

        FundUtilization utilization = new FundUtilization(
                app,
                request.getUtilizedAmount(),
                request.getProofDocumentPath(),
                request.getRemarks()
        );
        FundUtilization saved = utilizationRepository.save(utilization);

        ApplicationStatus previousStatus = app.getStatus();
        if (app.getStatus() != ApplicationStatus.UTILIZATION_PENDING) {
            app.setStatus(ApplicationStatus.UTILIZATION_PENDING);
            applicationRepository.save(app);
        }

        auditLogService.logAction(
                beneficiaryUser.getUsername(),
                "UTILIZATION_SUBMITTED",
                "FundUtilization",
                saved.getId().toString(),
                previousStatus.name(),
                ApplicationStatus.UTILIZATION_PENDING.name(),
                "Submitted utilization of " + request.getUtilizedAmount() + " with proof: " + request.getProofDocumentPath()
        );

        return mapToResponse(saved);
    }

    @Transactional
    public UtilizationResponse verifyUtilization(Long utilizationId, boolean approved, String remarks, User officer) {
        FundUtilization utilization = utilizationRepository.findById(utilizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilization record not found with ID: " + utilizationId));

        SubsidyApplication app = utilization.getApplication();
        utilization.setVerifiedByUser(officer);
        utilization.setVerificationStatus(approved ? UtilizationVerificationStatus.VERIFIED : UtilizationVerificationStatus.REJECTED);
        if (remarks != null && !remarks.isBlank()) {
            utilization.setRemarks(utilization.getRemarks() + " | Verification Note: " + remarks);
        }
        FundUtilization updated = utilizationRepository.save(utilization);

        // If approved, check if cumulative verified utilization satisfies 100% of released amount
        if (approved) {
            BigDecimal totalReleased = (app.getDisbursementPlan() != null) ?
                    app.getDisbursementPlan().getTotalReleasedAmount() : BigDecimal.ZERO;
            BigDecimal totalVerifiedUtilized = utilizationRepository.sumUtilizedByApplicationId(app.getId());

            if (totalReleased.compareTo(BigDecimal.ZERO) > 0 && totalVerifiedUtilized.compareTo(totalReleased) >= 0) {
                ApplicationStatus previousStatus = app.getStatus();
                app.setStatus(ApplicationStatus.COMPLETED);
                applicationRepository.save(app);

                auditLogService.logAction(
                        officer.getUsername(),
                        "APPLICATION_COMPLETED",
                        "SubsidyApplication",
                        app.getId().toString(),
                        previousStatus.name(),
                        ApplicationStatus.COMPLETED.name(),
                        "Application marked COMPLETED after 100% fund utilization verification"
                );
            }
        }

        auditLogService.logAction(
                officer.getUsername(),
                "UTILIZATION_VERIFIED",
                "FundUtilization",
                updated.getId().toString(),
                UtilizationVerificationStatus.PENDING.name(),
                updated.getVerificationStatus().name(),
                "Verification result: " + updated.getVerificationStatus() + ". Remarks: " + remarks
        );

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<UtilizationResponse> getUtilizationsByApplication(Long applicationId) {
        return utilizationRepository.findByApplicationId(applicationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UtilizationResponse mapToResponse(FundUtilization u) {
        SubsidyApplication app = u.getApplication();
        BigDecimal totalReleased = (app.getDisbursementPlan() != null) ?
                app.getDisbursementPlan().getTotalReleasedAmount() : BigDecimal.ZERO;
        BigDecimal cumulativeUtilized = utilizationRepository.sumUtilizedByApplicationId(app.getId());
        BigDecimal remaining = totalReleased.subtract(cumulativeUtilized);
        if (remaining.compareTo(BigDecimal.ZERO) < 0) remaining = BigDecimal.ZERO;

        BigDecimal percentage = BigDecimal.ZERO;
        if (totalReleased.compareTo(BigDecimal.ZERO) > 0) {
            percentage = cumulativeUtilized.multiply(new BigDecimal("100"))
                    .divide(totalReleased, 2, RoundingMode.HALF_UP);
        }

        UtilizationResponse res = new UtilizationResponse();
        res.setId(u.getId());
        res.setApplicationId(app.getId());
        res.setApplicationNumber(app.getApplicationNumber());
        res.setApprovedAmount(app.getApprovedAmount());
        res.setTotalReleasedAmount(totalReleased);
        res.setUtilizedAmount(u.getUtilizedAmount());
        res.setRemainingToUtilize(remaining);
        res.setUtilizationPercentage(percentage);
        res.setProofDocumentPath(u.getProofDocumentPath());
        res.setRemarks(u.getRemarks());
        res.setVerificationStatus(u.getVerificationStatus());
        if (u.getVerifiedByUser() != null) {
            res.setVerifiedByUserId(u.getVerifiedByUser().getId());
            res.setVerifiedByUsername(u.getVerifiedByUser().getUsername());
        }
        res.setSubmittedAt(u.getSubmittedAt());
        return res;
    }
}
