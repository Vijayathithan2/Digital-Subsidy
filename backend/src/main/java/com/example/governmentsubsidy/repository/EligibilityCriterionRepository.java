package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.EligibilityCriterion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EligibilityCriterionRepository extends JpaRepository<EligibilityCriterion, Long> {
    List<EligibilityCriterion> findBySchemeId(Long schemeId);
}
