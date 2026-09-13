package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.scheme.EligibilityCriterionDto;
import com.example.governmentsubsidy.dto.scheme.SchemeRequest;
import com.example.governmentsubsidy.dto.scheme.SchemeResponse;
import com.example.governmentsubsidy.entity.EligibilityCriterion;
import com.example.governmentsubsidy.entity.Scheme;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.exception.ResourceNotFoundException;
import com.example.governmentsubsidy.repository.SchemeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;
    private final AuditLogService auditLogService;

    public SchemeService(SchemeRepository schemeRepository, AuditLogService auditLogService) {
        this.schemeRepository = schemeRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public SchemeResponse createScheme(SchemeRequest request, String actingUser) {
        if (schemeRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Scheme with code '" + request.getCode() + "' already exists");
        }
        if (request.getMinGrantAmount().compareTo(request.getMaxGrantAmount()) > 0) {
            throw new BadRequestException("Minimum grant amount cannot exceed maximum grant amount");
        }

        Scheme scheme = new Scheme();
        scheme.setCode(request.getCode());
        scheme.setTitle(request.getTitle());
        scheme.setDescription(request.getDescription());
        scheme.setDepartment(request.getDepartment());
        scheme.setTotalBudget(request.getTotalBudget());
        scheme.setRemainingBudget(request.getTotalBudget());
        scheme.setMinGrantAmount(request.getMinGrantAmount());
        scheme.setMaxGrantAmount(request.getMaxGrantAmount());
        scheme.setMinEligibilityScore(request.getMinEligibilityScore() > 0 ? request.getMinEligibilityScore() : 60);
        scheme.setActive(request.isActive());

        if (request.getCriteria() != null) {
            for (EligibilityCriterionDto dto : request.getCriteria()) {
                EligibilityCriterion criterion = new EligibilityCriterion(
                        scheme,
                        dto.getCriterionType(),
                        dto.getComparisonOperator(),
                        dto.getExpectedValue(),
                        dto.getWeightPoints(),
                        dto.isMandatory(),
                        dto.getDescription()
                );
                scheme.addCriterion(criterion);
            }
        }

        Scheme saved = schemeRepository.save(scheme);

        auditLogService.logAction(
                actingUser,
                "SCHEME_CREATED",
                "Scheme",
                saved.getId().toString(),
                null,
                "ACTIVE",
                "Created scheme " + saved.getCode() + " - " + saved.getTitle() + " with budget " + saved.getTotalBudget()
        );

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SchemeResponse> getAllSchemes() {
        return schemeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SchemeResponse> getActiveSchemes() {
        return schemeRepository.findByActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Scheme getSchemeEntity(Long id) {
        return schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public SchemeResponse getSchemeById(Long id) {
        return mapToResponse(getSchemeEntity(id));
    }

    @Transactional
    public SchemeResponse updateScheme(Long id, SchemeRequest request, String actingUser) {
        Scheme scheme = getSchemeEntity(id);

        if (!scheme.getCode().equalsIgnoreCase(request.getCode()) && schemeRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Scheme code '" + request.getCode() + "' is already in use");
        }

        scheme.setCode(request.getCode());
        scheme.setTitle(request.getTitle());
        scheme.setDescription(request.getDescription());
        scheme.setDepartment(request.getDepartment());
        scheme.setMinGrantAmount(request.getMinGrantAmount());
        scheme.setMaxGrantAmount(request.getMaxGrantAmount());
        scheme.setMinEligibilityScore(request.getMinEligibilityScore());
        scheme.setActive(request.isActive());

        // Update criteria
        scheme.getCriteria().clear();
        if (request.getCriteria() != null) {
            for (EligibilityCriterionDto dto : request.getCriteria()) {
                EligibilityCriterion criterion = new EligibilityCriterion(
                        scheme,
                        dto.getCriterionType(),
                        dto.getComparisonOperator(),
                        dto.getExpectedValue(),
                        dto.getWeightPoints(),
                        dto.isMandatory(),
                        dto.getDescription()
                );
                scheme.addCriterion(criterion);
            }
        }

        Scheme updated = schemeRepository.save(scheme);

        auditLogService.logAction(
                actingUser,
                "SCHEME_UPDATED",
                "Scheme",
                id.toString(),
                null,
                updated.isActive() ? "ACTIVE" : "INACTIVE",
                "Updated scheme " + updated.getCode()
        );

        return mapToResponse(updated);
    }

    @Transactional
    public void deductSchemeBudget(Long schemeId, BigDecimal amount) {
        Scheme scheme = getSchemeEntity(schemeId);
        if (scheme.getRemainingBudget().compareTo(amount) < 0) {
            throw new BadRequestException("Scheme remaining budget (" + scheme.getRemainingBudget() + ") is insufficient for release (" + amount + ")");
        }
        scheme.setRemainingBudget(scheme.getRemainingBudget().subtract(amount));
        schemeRepository.save(scheme);
    }

    public SchemeResponse mapToResponse(Scheme s) {
        SchemeResponse res = new SchemeResponse();
        res.setId(s.getId());
        res.setCode(s.getCode());
        res.setTitle(s.getTitle());
        res.setDescription(s.getDescription());
        res.setDepartment(s.getDepartment());
        res.setTotalBudget(s.getTotalBudget());
        res.setRemainingBudget(s.getRemainingBudget());
        res.setMinGrantAmount(s.getMinGrantAmount());
        res.setMaxGrantAmount(s.getMaxGrantAmount());
        res.setMinEligibilityScore(s.getMinEligibilityScore());
        res.setActive(s.isActive());
        res.setCreatedAt(s.getCreatedAt());
        res.setUpdatedAt(s.getUpdatedAt());

        if (s.getCriteria() != null) {
            res.setCriteria(s.getCriteria().stream().map(c -> new EligibilityCriterionDto(
                    c.getCriterionType(),
                    c.getComparisonOperator(),
                    c.getExpectedValue(),
                    c.getWeightPoints(),
                    c.isMandatory(),
                    c.getDescription()
            )).collect(Collectors.toList()));
        }
        return res;
    }
}
