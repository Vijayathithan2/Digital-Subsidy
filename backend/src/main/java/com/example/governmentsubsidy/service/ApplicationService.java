package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.application.ApplicationRequest;
import com.example.governmentsubsidy.dto.application.ApplicationResponse;
import com.example.governmentsubsidy.dto.application.DocumentDto;
import com.example.governmentsubsidy.dto.eligibility.EligibilityEvaluationResult;
import com.example.governmentsubsidy.entity.*;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.DocumentType;
import com.example.governmentsubsidy.enums.RiskLevel;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.exception.InvalidStatusTransitionException;
import com.example.governmentsubsidy.exception.ResourceNotFoundException;
import com.example.governmentsubsidy.repository.ApplicationDocumentRepository;
import com.example.governmentsubsidy.repository.SubsidyApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final SubsidyApplicationRepository applicationRepository;
    private final ApplicationDocumentRepository documentRepository;
    private final BeneficiaryService beneficiaryService;
    private final SchemeService schemeService;
    private final RegionService regionService;
    private final EligibilityService eligibilityService;
    private final AuditLogService auditLogService;

    public ApplicationService(SubsidyApplicationRepository applicationRepository,
                              ApplicationDocumentRepository documentRepository,
                              BeneficiaryService beneficiaryService,
                              SchemeService schemeService,
                              RegionService regionService,
                              EligibilityService eligibilityService,
                              AuditLogService auditLogService) {
        this.applicationRepository = applicationRepository;
        this.documentRepository = documentRepository;
        this.beneficiaryService = beneficiaryService;
        this.schemeService = schemeService;
        this.regionService = regionService;
        this.eligibilityService = eligibilityService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest request, String actingUser) {
        Beneficiary beneficiary = beneficiaryService.getBeneficiaryEntity(request.getBeneficiaryId());
        Scheme scheme = schemeService.getSchemeEntity(request.getSchemeId());
        Region region = regionService.getRegionById(request.getRegionId());

        if (!scheme.isActive()) {
            throw new BadRequestException("Scheme '" + scheme.getTitle() + "' is currently inactive");
        }

        if (request.getAppliedAmount().compareTo(scheme.getMinGrantAmount()) < 0 ||
                request.getAppliedAmount().compareTo(scheme.getMaxGrantAmount()) > 0) {
            throw new BadRequestException("Applied amount must be between " + scheme.getMinGrantAmount() + " and " + scheme.getMaxGrantAmount());
        }

        String applicationNumber = generateApplicationNumber();

        SubsidyApplication application = new SubsidyApplication();
        application.setApplicationNumber(applicationNumber);
        application.setBeneficiary(beneficiary);
        application.setScheme(scheme);
        application.setRegion(region);
        application.setAppliedAmount(request.getAppliedAmount());
        application.setStatus(ApplicationStatus.DRAFT);
        application.setRiskLevel(RiskLevel.LOW);

        SubsidyApplication saved = applicationRepository.save(application);

        auditLogService.logAction(
                actingUser,
                "APPLICATION_CREATED",
                "SubsidyApplication",
                saved.getId().toString(),
                null,
                ApplicationStatus.DRAFT.name(),
                "Application created for scheme: " + scheme.getCode() + " with amount: " + request.getAppliedAmount()
        );

        return mapToResponse(saved);
    }

    @Transactional
    public DocumentDto attachDocument(Long applicationId, DocumentType documentType,
                                     String fileName, String fileType, String filePath, String actingUser) {
        SubsidyApplication application = getApplicationEntity(applicationId);

        ApplicationDocument doc = new ApplicationDocument(application, documentType, fileName, fileType, filePath);
        ApplicationDocument saved = documentRepository.save(doc);

        auditLogService.logAction(
                actingUser,
                "DOCUMENT_ATTACHED",
                "ApplicationDocument",
                saved.getId().toString(),
                null,
                "ATTACHED",
                "Document " + documentType + " (" + fileName + ") attached to application " + application.getApplicationNumber()
        );

        return new DocumentDto(
                saved.getId(),
                saved.getDocumentType(),
                saved.getFileName(),
                saved.getFileType(),
                saved.getFilePath(),
                saved.getVerificationStatus(),
                saved.getUploadedAt()
        );
    }

    @Transactional
    public ApplicationResponse submitApplication(Long applicationId, String actingUser) {
        SubsidyApplication app = getApplicationEntity(applicationId);

        if (app.getStatus() != ApplicationStatus.DRAFT) {
            throw new InvalidStatusTransitionException(app.getStatus(), ApplicationStatus.SUBMITTED);
        }

        app.setStatus(ApplicationStatus.SUBMITTED);
        SubsidyApplication saved = applicationRepository.save(app);

        auditLogService.logAction(
                actingUser,
                "APPLICATION_SUBMITTED",
                "SubsidyApplication",
                saved.getId().toString(),
                ApplicationStatus.DRAFT.name(),
                ApplicationStatus.SUBMITTED.name(),
                "Application submitted by beneficiary"
        );

        return mapToResponse(saved);
    }

    @Transactional
    public EligibilityEvaluationResult evaluateEligibility(Long applicationId, String actingUser) {
        SubsidyApplication app = getApplicationEntity(applicationId);

        if (app.getStatus() != ApplicationStatus.SUBMITTED) {
            throw new InvalidStatusTransitionException("Application must be in SUBMITTED status to evaluate eligibility. Current status: " + app.getStatus());
        }

        EligibilityEvaluationResult evaluation = eligibilityService.evaluate(app);

        app.setEligibilityScore(evaluation.getTotalScore());
        app.setRiskLevel(evaluation.getAssignedRiskLevel());

        ApplicationStatus previousStatus = app.getStatus();
        ApplicationStatus newStatus;

        if (evaluation.isEligible()) {
            newStatus = ApplicationStatus.FIELD_VERIFICATION;
            app.setRejectionReason(null);
        } else {
            newStatus = ApplicationStatus.REJECTED;
            app.setRejectionReason(evaluation.getRecommendation());
        }

        app.setStatus(newStatus);
        SubsidyApplication saved = applicationRepository.save(app);

        auditLogService.logAction(
                actingUser,
                "ELIGIBILITY_EVALUATED",
                "SubsidyApplication",
                saved.getId().toString(),
                previousStatus.name(),
                newStatus.name(),
                "Score: " + evaluation.getTotalScore() + ", Risk: " + evaluation.getAssignedRiskLevel() + ", Recommendation: " + evaluation.getRecommendation()
        );

        return evaluation;
    }

    @Transactional(readOnly = true)
    public SubsidyApplication getApplicationEntity(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id) {
        return mapToResponse(getApplicationEntity(id));
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationByNumber(String applicationNumber) {
        SubsidyApplication app = applicationRepository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with number: " + applicationNumber));
        return mapToResponse(app);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByBeneficiary(Long beneficiaryId) {
        return applicationRepository.findByBeneficiaryId(beneficiaryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByUser(Long userId) {
        return applicationRepository.findByBeneficiaryUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAllApplications(ApplicationStatus status) {
        List<SubsidyApplication> list = (status != null) ?
                applicationRepository.findByStatus(status) :
                applicationRepository.findAll();
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private String generateApplicationNumber() {
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "SUB-" + datePrefix + "-" + randomSuffix;
    }

    public ApplicationResponse mapToResponse(SubsidyApplication a) {
        ApplicationResponse res = new ApplicationResponse();
        res.setId(a.getId());
        res.setApplicationNumber(a.getApplicationNumber());
        res.setBeneficiaryId(a.getBeneficiary().getId());
        res.setBeneficiaryName(a.getBeneficiary().getUser().getFullName());
        res.setBeneficiaryIdentityNumber(a.getBeneficiary().getIdentityNumber());
        res.setSchemeId(a.getScheme().getId());
        res.setSchemeCode(a.getScheme().getCode());
        res.setSchemeTitle(a.getScheme().getTitle());
        res.setRegionId(a.getRegion().getId());
        res.setRegionName(a.getRegion().getDistrictName());
        res.setStateName(a.getRegion().getStateName());
        res.setAppliedAmount(a.getAppliedAmount());
        res.setApprovedAmount(a.getApprovedAmount());
        res.setStatus(a.getStatus());
        res.setRiskLevel(a.getRiskLevel());
        res.setEligibilityScore(a.getEligibilityScore());
        res.setRejectionReason(a.getRejectionReason());
        res.setDisbursementPlanId(a.getDisbursementPlan() != null ? a.getDisbursementPlan().getId() : null);
        res.setCreatedAt(a.getCreatedAt());
        res.setUpdatedAt(a.getUpdatedAt());

        if (a.getDocuments() != null) {
            res.setDocuments(a.getDocuments().stream().map(d -> new DocumentDto(
                    d.getId(),
                    d.getDocumentType(),
                    d.getFileName(),
                    d.getFileType(),
                    d.getFilePath(),
                    d.getVerificationStatus(),
                    d.getUploadedAt()
            )).collect(Collectors.toList()));
        }
        return res;
    }
}
