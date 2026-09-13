package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.analytics.DashboardAnalyticsResponse;
import com.example.governmentsubsidy.dto.analytics.RegionAnalyticsDto;
import com.example.governmentsubsidy.dto.analytics.SchemeAnalyticsDto;
import com.example.governmentsubsidy.entity.Region;
import com.example.governmentsubsidy.entity.Scheme;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.BeneficiaryCategory;
import com.example.governmentsubsidy.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final SubsidyApplicationRepository applicationRepository;
    private final SchemeRepository schemeRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final RegionRepository regionRepository;
    private final FundReleaseRepository fundReleaseRepository;
    private final FundUtilizationRepository utilizationRepository;
    private final DisbursementMilestoneRepository milestoneRepository;

    public AnalyticsService(SubsidyApplicationRepository applicationRepository,
                            SchemeRepository schemeRepository,
                            BeneficiaryRepository beneficiaryRepository,
                            RegionRepository regionRepository,
                            FundReleaseRepository fundReleaseRepository,
                            FundUtilizationRepository utilizationRepository,
                            DisbursementMilestoneRepository milestoneRepository) {
        this.applicationRepository = applicationRepository;
        this.schemeRepository = schemeRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.regionRepository = regionRepository;
        this.fundReleaseRepository = fundReleaseRepository;
        this.utilizationRepository = utilizationRepository;
        this.milestoneRepository = milestoneRepository;
    }

    @Transactional(readOnly = true)
    public DashboardAnalyticsResponse getDashboardAnalytics() {
        DashboardAnalyticsResponse res = new DashboardAnalyticsResponse();

        res.setTotalSchemes(schemeRepository.count());
        res.setActiveSchemes(schemeRepository.findByActiveTrue().size());
        res.setTotalBeneficiaries(beneficiaryRepository.count());

        long totalApps = applicationRepository.count();
        res.setTotalApplications(totalApps);

        long approvedApps = applicationRepository.countByStatusIn(List.of(
                ApplicationStatus.FINANCE_APPROVAL,
                ApplicationStatus.DISBURSEMENT_PLANNED,
                ApplicationStatus.MILESTONE_PENDING,
                ApplicationStatus.DISBURSEMENT_IN_PROGRESS,
                ApplicationStatus.FULLY_DISBURSED,
                ApplicationStatus.UTILIZATION_PENDING,
                ApplicationStatus.COMPLETED
        ));
        res.setApprovedApplications(approvedApps);

        long rejectedApps = applicationRepository.countByStatus(ApplicationStatus.REJECTED);
        res.setRejectedApplications(rejectedApps);

        long pendingApps = applicationRepository.countByStatusIn(List.of(
                ApplicationStatus.SUBMITTED,
                ApplicationStatus.ELIGIBILITY_EVALUATED,
                ApplicationStatus.FIELD_VERIFICATION,
                ApplicationStatus.DISTRICT_REVIEW,
                ApplicationStatus.REVERIFICATION_REQUIRED
        ));
        res.setPendingApplications(pendingApps);

        res.setFullyDisbursedApplications(applicationRepository.countByStatus(ApplicationStatus.FULLY_DISBURSED));
        res.setCompletedApplications(applicationRepository.countByStatus(ApplicationStatus.COMPLETED));

        BigDecimal approvedFunds = applicationRepository.sumTotalApprovedFunds();
        BigDecimal releasedFunds = fundReleaseRepository.sumTotalReleasedFunds();
        BigDecimal utilizedFunds = utilizationRepository.sumTotalVerifiedUtilizedFunds();

        res.setTotalApprovedFunds(approvedFunds != null ? approvedFunds : BigDecimal.ZERO);
        res.setTotalReleasedFunds(releasedFunds != null ? releasedFunds : BigDecimal.ZERO);
        res.setTotalUtilizedFunds(utilizedFunds != null ? utilizedFunds : BigDecimal.ZERO);

        BigDecimal remainingToRelease = res.getTotalApprovedFunds().subtract(res.getTotalReleasedFunds());
        if (remainingToRelease.compareTo(BigDecimal.ZERO) < 0) remainingToRelease = BigDecimal.ZERO;
        res.setRemainingFundsToRelease(remainingToRelease);

        BigDecimal remainingToUtilize = res.getTotalReleasedFunds().subtract(res.getTotalUtilizedFunds());
        if (remainingToUtilize.compareTo(BigDecimal.ZERO) < 0) remainingToUtilize = BigDecimal.ZERO;
        res.setRemainingFundsToUtilize(remainingToUtilize);

        double utilPct = 0.0;
        if (res.getTotalReleasedFunds().compareTo(BigDecimal.ZERO) > 0) {
            utilPct = res.getTotalUtilizedFunds()
                    .multiply(new BigDecimal("100"))
                    .divide(res.getTotalReleasedFunds(), 2, RoundingMode.HALF_UP)
                    .doubleValue();
        }
        res.setOverallUtilizationPercentage(utilPct);

        res.setOverdueMilestonesCount(milestoneRepository.findOverdueMilestones(LocalDate.now()).size());

        // Category breakdown
        Map<String, Long> categoryMap = new HashMap<>();
        for (BeneficiaryCategory cat : BeneficiaryCategory.values()) {
            categoryMap.put(cat.name(), beneficiaryRepository.countByCategory(cat));
        }
        res.setCategoryDistribution(categoryMap);

        // Scheme breakdown
        List<SchemeAnalyticsDto> schemeAnalytics = getSchemeAnalytics();
        res.setSchemeBreakdown(schemeAnalytics);

        // Region breakdown
        List<RegionAnalyticsDto> regionAnalytics = getRegionAnalytics();
        res.setRegionBreakdown(regionAnalytics);

        return res;
    }

    @Transactional(readOnly = true)
    public List<SchemeAnalyticsDto> getSchemeAnalytics() {
        List<Scheme> schemes = schemeRepository.findAll();
        List<SchemeAnalyticsDto> result = new ArrayList<>();

        for (Scheme s : schemes) {
            SchemeAnalyticsDto dto = new SchemeAnalyticsDto();
            dto.setSchemeId(s.getId());
            dto.setSchemeCode(s.getCode());
            dto.setSchemeTitle(s.getTitle());
            dto.setDepartment(s.getDepartment());
            dto.setTotalBudget(s.getTotalBudget());
            dto.setRemainingBudget(s.getRemainingBudget());

            BigDecimal approved = applicationRepository.sumApprovedFundsBySchemeId(s.getId());
            BigDecimal released = fundReleaseRepository.sumReleasedFundsBySchemeId(s.getId());
            BigDecimal utilized = utilizationRepository.sumVerifiedUtilizedFundsBySchemeId(s.getId());

            dto.setApprovedFunds(approved != null ? approved : BigDecimal.ZERO);
            dto.setReleasedFunds(released != null ? released : BigDecimal.ZERO);
            dto.setUtilizedFunds(utilized != null ? utilized : BigDecimal.ZERO);
            dto.setTotalApplications(applicationRepository.countBySchemeId(s.getId()));

            double exhaustPct = 0.0;
            if (s.getTotalBudget().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal spent = s.getTotalBudget().subtract(s.getRemainingBudget());
                exhaustPct = spent.multiply(new BigDecimal("100"))
                        .divide(s.getTotalBudget(), 2, RoundingMode.HALF_UP)
                        .doubleValue();
            }
            dto.setBudgetExhaustionPercentage(exhaustPct);

            result.add(dto);
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<RegionAnalyticsDto> getRegionAnalytics() {
        List<Region> regions = regionRepository.findAll();
        List<RegionAnalyticsDto> result = new ArrayList<>();

        for (Region r : regions) {
            RegionAnalyticsDto dto = new RegionAnalyticsDto();
            dto.setRegionId(r.getId());
            dto.setRegionCode(r.getCode());
            dto.setStateName(r.getStateName());
            dto.setDistrictName(r.getDistrictName());
            dto.setAllocatedBudget(r.getAllocatedBudget());
            dto.setUtilizedBudget(r.getUtilizedBudget());

            BigDecimal approved = applicationRepository.sumApprovedFundsByRegionId(r.getId());
            BigDecimal released = fundReleaseRepository.sumReleasedFundsByRegionId(r.getId());

            dto.setApprovedFunds(approved != null ? approved : BigDecimal.ZERO);
            dto.setReleasedFunds(released != null ? released : BigDecimal.ZERO);
            dto.setTotalApplications(applicationRepository.countByRegionId(r.getId()));

            double utilRate = 0.0;
            if (r.getAllocatedBudget().compareTo(BigDecimal.ZERO) > 0) {
                utilRate = r.getUtilizedBudget().multiply(new BigDecimal("100"))
                        .divide(r.getAllocatedBudget(), 2, RoundingMode.HALF_UP)
                        .doubleValue();
            }
            dto.setBudgetUtilizationRate(utilRate);

            result.add(dto);
        }
        return result;
    }
}
