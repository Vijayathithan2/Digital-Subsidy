package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.FundUtilization;
import com.example.governmentsubsidy.enums.UtilizationVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.math.BigDecimal;
import java.util.List;


public interface FundUtilizationRepository extends JpaRepository<FundUtilization, Long> {
    List<FundUtilization> findByApplicationId(Long applicationId);
    List<FundUtilization> findByVerificationStatus(UtilizationVerificationStatus status);

    @Query("SELECT COALESCE(SUM(fu.utilizedAmount), 0) FROM FundUtilization fu WHERE fu.application.id = :applicationId")
    BigDecimal sumUtilizedByApplicationId(@Param("applicationId") Long applicationId);

    @Query("SELECT COALESCE(SUM(fu.utilizedAmount), 0) FROM FundUtilization fu WHERE fu.verificationStatus = 'VERIFIED'")
    BigDecimal sumTotalVerifiedUtilizedFunds();

    @Query("SELECT COALESCE(SUM(fu.utilizedAmount), 0) FROM FundUtilization fu WHERE fu.application.scheme.id = :schemeId AND fu.verificationStatus = 'VERIFIED'")
    BigDecimal sumVerifiedUtilizedFundsBySchemeId(@Param("schemeId") Long schemeId);

    @Query("SELECT COALESCE(SUM(fu.utilizedAmount), 0) FROM FundUtilization fu WHERE fu.application.region.id = :regionId AND fu.verificationStatus = 'VERIFIED'")
    BigDecimal sumVerifiedUtilizedFundsByRegionId(@Param("regionId") Long regionId);
}
