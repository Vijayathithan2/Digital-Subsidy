package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.beneficiary.BeneficiaryRequest;
import com.example.governmentsubsidy.dto.beneficiary.BeneficiaryResponse;
import com.example.governmentsubsidy.entity.Beneficiary;
import com.example.governmentsubsidy.entity.Region;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.enums.KycStatus;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.exception.ResourceNotFoundException;
import com.example.governmentsubsidy.repository.BeneficiaryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final RegionService regionService;
    private final AuditLogService auditLogService;

    public BeneficiaryService(BeneficiaryRepository beneficiaryRepository,
                              RegionService regionService,
                              AuditLogService auditLogService) {
        this.beneficiaryRepository = beneficiaryRepository;
        this.regionService = regionService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public BeneficiaryResponse registerBeneficiaryProfile(User user, BeneficiaryRequest request) {
        if (beneficiaryRepository.findByUser(user).isPresent()) {
            throw new BadRequestException("Beneficiary profile already exists for user: " + user.getUsername());
        }
        if (beneficiaryRepository.existsByIdentityNumber(request.getIdentityNumber())) {
            throw new BadRequestException("Identity number '" + request.getIdentityNumber() + "' is already registered");
        }

        Region region = regionService.getRegionById(request.getRegionId());

        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setUser(user);
        beneficiary.setRegion(region);
        beneficiary.setIdentityNumber(request.getIdentityNumber());
        beneficiary.setCategory(request.getCategory());
        beneficiary.setDateOfBirth(request.getDateOfBirth());
        beneficiary.setAnnualIncome(request.getAnnualIncome());
        beneficiary.setLandHoldingHectares(request.getLandHoldingHectares() != null ? request.getLandHoldingHectares() : java.math.BigDecimal.ZERO);
        beneficiary.setDisabled(request.isDisabled());
        beneficiary.setBankAccountNumber(request.getBankAccountNumber());
        beneficiary.setBankIfscCode(request.getBankIfscCode());
        beneficiary.setBankName(request.getBankName());
        beneficiary.setAddressLine(request.getAddressLine());
        beneficiary.setKycStatus(KycStatus.VERIFIED); // In government flow, auto-verified or pending

        Beneficiary saved = beneficiaryRepository.save(beneficiary);

        auditLogService.logAction(
                user.getUsername(),
                "BENEFICIARY_REGISTERED",
                "Beneficiary",
                saved.getId().toString(),
                null,
                saved.getKycStatus().name(),
                "Beneficiary profile registered for identity: " + saved.getIdentityNumber()
        );

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public BeneficiaryResponse getMyBeneficiaryProfile(User user) {
        Beneficiary beneficiary = beneficiaryRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("No beneficiary profile found for current user"));
        return mapToResponse(beneficiary);
    }

    @Transactional(readOnly = true)
    public Beneficiary getBeneficiaryEntity(Long id) {
        return beneficiaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public BeneficiaryResponse getBeneficiaryById(Long id) {
        return mapToResponse(getBeneficiaryEntity(id));
    }

    @Transactional(readOnly = true)
    public List<BeneficiaryResponse> getAllBeneficiaries() {
        return beneficiaryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BeneficiaryResponse updateKycStatus(Long id, KycStatus status, String actingUser) {
        Beneficiary beneficiary = getBeneficiaryEntity(id);
        KycStatus prev = beneficiary.getKycStatus();
        beneficiary.setKycStatus(status);
        Beneficiary updated = beneficiaryRepository.save(beneficiary);

        auditLogService.logAction(
                actingUser,
                "KYC_STATUS_UPDATED",
                "Beneficiary",
                id.toString(),
                prev.name(),
                status.name(),
                "KYC status updated to " + status
        );

        return mapToResponse(updated);
    }

    public BeneficiaryResponse mapToResponse(Beneficiary b) {
        BeneficiaryResponse res = new BeneficiaryResponse();
        res.setId(b.getId());
        res.setUserId(b.getUser().getId());
        res.setUsername(b.getUser().getUsername());
        res.setFullName(b.getUser().getFullName());
        res.setEmail(b.getUser().getEmail());
        res.setPhone(b.getUser().getPhone());
        res.setRegionId(b.getRegion().getId());
        res.setRegionName(b.getRegion().getDistrictName());
        res.setStateName(b.getRegion().getStateName());
        res.setIdentityNumber(b.getIdentityNumber());
        res.setCategory(b.getCategory());
        res.setDateOfBirth(b.getDateOfBirth());
        res.setAnnualIncome(b.getAnnualIncome());
        res.setLandHoldingHectares(b.getLandHoldingHectares());
        res.setDisabled(b.isDisabled());
        res.setBankAccountNumber(b.getBankAccountNumber());
        res.setBankIfscCode(b.getBankIfscCode());
        res.setBankName(b.getBankName());
        res.setAddressLine(b.getAddressLine());
        res.setKycStatus(b.getKycStatus());
        res.setCreatedAt(b.getCreatedAt());
        return res;
    }
}
