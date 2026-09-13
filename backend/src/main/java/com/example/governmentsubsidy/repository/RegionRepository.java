package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Long> {
    Optional<Region> findByCode(String code);
    boolean existsByCode(String code);
}
