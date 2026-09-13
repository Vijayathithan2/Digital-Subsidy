package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.SubsidyApplication;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


public interface SubsidyApplicationRepository extends JpaRepository<SubsidyApplication, Long> {
    Optional<SubsidyApplication> findByApplicationNumber(String applicationNumber);
    boolean existsByApplicationNumber(String applicationNumber);

    List<SubsidyApplication> findByBeneficiaryId(Long beneficiaryId);
    List<SubsidyApplication> findByBeneficiaryUserId(Long userId);
    List<SubsidyApplication> findBySchemeId(Long schemeId);
    List<SubsidyApplication> findByRegionId(Long regionId);
    List<SubsidyApplication> findByStatus(ApplicationStatus status);
    List<SubsidyApplication> findByStatusIn(List<ApplicationStatus> statuses);
    List<SubsidyApplication> findByRiskLevel(RiskLevel riskLevel);

    long countByStatus(ApplicationStatus status);
    long countByStatusIn(List<ApplicationStatus> statuses);
    long countBySchemeId(Long schemeId);
    long countByRegionId(Long regionId);

    @Query("SELECT COALESCE(SUM(a.approvedAmount), 0) FROM SubsidyApplication a WHERE a.status NOT IN ('DRAFT', 'REJECTED')")
    BigDecimal sumTotalApprovedFunds();

    @Query("SELECT COALESCE(SUM(a.approvedAmount), 0) FROM SubsidyApplication a WHERE a.scheme.id = :schemeId AND a.status NOT IN ('DRAFT', 'REJECTED')")
    BigDecimal sumApprovedFundsBySchemeId(@Param("schemeId") Long schemeId);

    @Query("SELECT COALESCE(SUM(a.approvedAmount), 0) FROM SubsidyApplication a WHERE a.region.id = :regionId AND a.status NOT IN ('DRAFT', 'REJECTED')")
    BigDecimal sumApprovedFundsByRegionId(@Param("regionId") Long regionId);
}
