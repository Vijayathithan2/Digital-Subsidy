package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.verification.VerificationRequest;
import com.example.governmentsubsidy.dto.verification.VerificationResponse;
import com.example.governmentsubsidy.entity.SubsidyApplication;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.entity.Verification;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.VerificationDecision;
import com.example.governmentsubsidy.enums.VerificationStage;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.exception.InvalidStatusTransitionException;
import com.example.governmentsubsidy.repository.SubsidyApplicationRepository;
import com.example.governmentsubsidy.repository.VerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VerificationWorkflowService {

    private final SubsidyApplicationRepository applicationRepository;
    private final VerificationRepository verificationRepository;
    private final ApplicationService applicationService;
    private final AuditLogService auditLogService;

    public VerificationWorkflowService(SubsidyApplicationRepository applicationRepository,
                                       VerificationRepository verificationRepository,
                                       ApplicationService applicationService,
                                       AuditLogService auditLogService) {
        this.applicationRepository = applicationRepository;
        this.verificationRepository = verificationRepository;
        this.applicationService = applicationService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public VerificationResponse performFieldVerification(Long applicationId, VerificationRequest request, User officer) {
        SubsidyApplication app = applicationService.getApplicationEntity(applicationId);

        if (app.getStatus() != ApplicationStatus.FIELD_VERIFICATION &&
                app.getStatus() != ApplicationStatus.REVERIFICATION_REQUIRED) {
            throw new InvalidStatusTransitionException(
                    "Field verification cannot be performed when application is in status: " + app.getStatus()
            );
        }

        ApplicationStatus previousStatus = app.getStatus();
        ApplicationStatus resultingStatus;

        switch (request.getDecision()) {
            case APPROVED -> resultingStatus = ApplicationStatus.DISTRICT_REVIEW;
            case REJECTED -> {
                resultingStatus = ApplicationStatus.REJECTED;
                app.setRejectionReason("Field Verification Failed: " + request.getRemarks());
            }
            case REVERIFICATION_REQUESTED -> resultingStatus = ApplicationStatus.REVERIFICATION_REQUIRED;
            default -> throw new BadRequestException("Unsupported decision for field verification: " + request.getDecision());
        }

        app.setStatus(resultingStatus);
        applicationRepository.save(app);

        Verification verification = new Verification(
                app,
                VerificationStage.FIELD_VERIFICATION,
                officer,
                request.getDecision(),
                request.getRemarks()
        );
        Verification savedVerification = verificationRepository.save(verification);

        auditLogService.logAction(
                officer.getUsername(),
                "FIELD_VERIFICATION_PERFORMED",
                "SubsidyApplication",
                app.getId().toString(),
                previousStatus.name(),
                resultingStatus.name(),
                "Decision: " + request.getDecision() + ". Remarks: " + request.getRemarks()
        );

        return mapToResponse(savedVerification, resultingStatus);
    }

    @Transactional
    public VerificationResponse performDistrictReview(Long applicationId, VerificationRequest request, User officer) {
        SubsidyApplication app = applicationService.getApplicationEntity(applicationId);

        if (app.getStatus() != ApplicationStatus.DISTRICT_REVIEW) {
            throw new InvalidStatusTransitionException(
                    "District review cannot be performed when application is in status: " + app.getStatus()
            );
        }

        ApplicationStatus previousStatus = app.getStatus();
        ApplicationStatus resultingStatus;

        switch (request.getDecision()) {
            case APPROVED -> resultingStatus = ApplicationStatus.FINANCE_APPROVAL;
            case REJECTED -> {
                resultingStatus = ApplicationStatus.REJECTED;
                app.setRejectionReason("District Review Rejected: " + request.getRemarks());
            }
            case REVERIFICATION_REQUESTED -> resultingStatus = ApplicationStatus.REVERIFICATION_REQUIRED;
            default -> throw new BadRequestException("Unsupported decision for district review: " + request.getDecision());
        }

        app.setStatus(resultingStatus);
        applicationRepository.save(app);

        Verification verification = new Verification(
                app,
                VerificationStage.DISTRICT_REVIEW,
                officer,
                request.getDecision(),
                request.getRemarks()
        );
        Verification savedVerification = verificationRepository.save(verification);

        auditLogService.logAction(
                officer.getUsername(),
                "DISTRICT_REVIEW_PERFORMED",
                "SubsidyApplication",
                app.getId().toString(),
                previousStatus.name(),
                resultingStatus.name(),
                "Decision: " + request.getDecision() + ". Remarks: " + request.getRemarks()
        );

        return mapToResponse(savedVerification, resultingStatus);
    }

    @Transactional
    public VerificationResponse performFinanceApproval(Long applicationId, BigDecimal approvedAmount,
                                                       VerificationRequest request, User officer) {
        SubsidyApplication app = applicationService.getApplicationEntity(applicationId);

        if (app.getStatus() != ApplicationStatus.FINANCE_APPROVAL) {
            throw new InvalidStatusTransitionException(
                    "Finance approval cannot be performed when application is in status: " + app.getStatus()
            );
        }

        ApplicationStatus previousStatus = app.getStatus();
        ApplicationStatus resultingStatus;

        if (request.getDecision() == VerificationDecision.APPROVED) {
            BigDecimal finalApprovedAmount = (approvedAmount != null && approvedAmount.compareTo(BigDecimal.ZERO) > 0)
                    ? approvedAmount : app.getAppliedAmount();

            if (finalApprovedAmount.compareTo(app.getScheme().getMaxGrantAmount()) > 0) {
                throw new BadRequestException("Approved amount cannot exceed scheme max grant of " + app.getScheme().getMaxGrantAmount());
            }
            if (finalApprovedAmount.compareTo(app.getAppliedAmount()) > 0) {
                throw new BadRequestException("Approved amount cannot exceed applicant requested amount of " + app.getAppliedAmount());
            }

            app.setApprovedAmount(finalApprovedAmount);
            resultingStatus = ApplicationStatus.DISBURSEMENT_PLANNED;
        } else if (request.getDecision() == VerificationDecision.REJECTED) {
            resultingStatus = ApplicationStatus.REJECTED;
            app.setRejectionReason("Finance Review Rejected: " + request.getRemarks());
        } else {
            throw new BadRequestException("Finance stage supports only APPROVED or REJECTED decisions");
        }

        app.setStatus(resultingStatus);
        applicationRepository.save(app);

        Verification verification = new Verification(
                app,
                VerificationStage.FINANCE_APPROVAL,
                officer,
                request.getDecision(),
                request.getRemarks()
        );
        Verification savedVerification = verificationRepository.save(verification);

        auditLogService.logAction(
                officer.getUsername(),
                "FINANCE_APPROVAL_PERFORMED",
                "SubsidyApplication",
                app.getId().toString(),
                previousStatus.name(),
                resultingStatus.name(),
                "Decision: " + request.getDecision() + ", Approved Amount: " + app.getApprovedAmount() + ". Remarks: " + request.getRemarks()
        );

        return mapToResponse(savedVerification, resultingStatus);
    }

    @Transactional(readOnly = true)
    public List<VerificationResponse> getVerificationsForApplication(Long applicationId) {
        return verificationRepository.findByApplicationIdOrderByVerifiedAtDesc(applicationId).stream()
                .map(v -> mapToResponse(v, v.getApplication().getStatus()))
                .collect(Collectors.toList());
    }

    private VerificationResponse mapToResponse(Verification v, ApplicationStatus resultingStatus) {
        VerificationResponse res = new VerificationResponse();
        res.setId(v.getId());
        res.setApplicationId(v.getApplication().getId());
        res.setApplicationNumber(v.getApplication().getApplicationNumber());
        res.setStage(v.getStage());
        res.setVerifiedByUserId(v.getVerifiedByUser().getId());
        res.setVerifiedByUsername(v.getVerifiedByUser().getUsername());
        res.setDecision(v.getDecision());
        res.setRemarks(v.getRemarks());
        res.setResultingStatus(resultingStatus);
        res.setVerifiedAt(v.getVerifiedAt());
        return res;
    }
}
