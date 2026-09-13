package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.DisbursementPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DisbursementPlanRepository extends JpaRepository<DisbursementPlan, Long> {
    Optional<DisbursementPlan> findByApplicationId(Long applicationId);
    boolean existsByApplicationId(Long applicationId);
}
