package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;


public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    Optional<Scheme> findByCode(String code);
    boolean existsByCode(String code);
    List<Scheme> findByActiveTrue();
    List<Scheme> findByDepartmentIgnoreCase(String department);
}
