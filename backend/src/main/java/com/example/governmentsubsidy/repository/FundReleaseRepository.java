package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.FundRelease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface FundReleaseRepository extends JpaRepository<FundRelease, Long> {
    Optional<FundRelease> findByTransactionRefNumber(String transactionRefNumber);
    Optional<FundRelease> findByMilestoneId(Long milestoneId);
    boolean existsByMilestoneId(Long milestoneId);
    List<FundRelease> findByReleasedByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(fr.releasedAmount), 0) FROM FundRelease fr WHERE fr.treasuryStatus = 'PROCESSED'")
    BigDecimal sumTotalReleasedFunds();

    @Query("SELECT COALESCE(SUM(fr.releasedAmount), 0) FROM FundRelease fr WHERE fr.milestone.plan.application.scheme.id = :schemeId AND fr.treasuryStatus = 'PROCESSED'")
    BigDecimal sumReleasedFundsBySchemeId(@Param("schemeId") Long schemeId);

    @Query("SELECT COALESCE(SUM(fr.releasedAmount), 0) FROM FundRelease fr WHERE fr.milestone.plan.application.region.id = :regionId AND fr.treasuryStatus = 'PROCESSED'")
    BigDecimal sumReleasedFundsByRegionId(@Param("regionId") Long regionId);
}
