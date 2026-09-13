package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.DisbursementMilestone;
import com.example.governmentsubsidy.enums.MilestoneReleaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface DisbursementMilestoneRepository extends JpaRepository<DisbursementMilestone, Long> {
    List<DisbursementMilestone> findByPlanIdOrderBySequenceNumberAsc(Long planId);
    List<DisbursementMilestone> findByPlanApplicationIdOrderBySequenceNumberAsc(Long applicationId);
    List<DisbursementMilestone> findByReleaseStatus(MilestoneReleaseStatus releaseStatus);

    @Query("SELECT m FROM DisbursementMilestone m WHERE m.releaseStatus = 'PENDING' AND m.dueDate < :today")
    List<DisbursementMilestone> findOverdueMilestones(@Param("today") LocalDate today);

    long countByReleaseStatus(MilestoneReleaseStatus releaseStatus);
}
