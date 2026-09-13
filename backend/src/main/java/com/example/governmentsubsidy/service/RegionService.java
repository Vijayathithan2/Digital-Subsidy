package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.entity.Region;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.exception.ResourceNotFoundException;
import com.example.governmentsubsidy.repository.RegionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class RegionService {

    private final RegionRepository regionRepository;
    private final AuditLogService auditLogService;

    public RegionService(RegionRepository regionRepository, AuditLogService auditLogService) {
        this.regionRepository = regionRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public Region createRegion(Region region, String actingUser) {
        if (regionRepository.existsByCode(region.getCode())) {
            throw new BadRequestException("Region with code '" + region.getCode() + "' already exists");
        }
        Region saved = regionRepository.save(region);
        auditLogService.logAction(actingUser, "REGION_CREATED", "Region", saved.getId().toString(),
                null, "ACTIVE", "Created region " + saved.getCode() + " with budget " + saved.getAllocatedBudget());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Region> getAllRegions() {
        return regionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Region getRegionById(Long id) {
        return regionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Region not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Region getRegionByCode(String code) {
        return regionRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Region not found with code: " + code));
    }

    @Transactional
    public void recordRegionalFundDisbursement(Long regionId, BigDecimal amount) {
        Region region = getRegionById(regionId);
        region.setUtilizedBudget(region.getUtilizedBudget().add(amount));
        regionRepository.save(region);
    }
}
