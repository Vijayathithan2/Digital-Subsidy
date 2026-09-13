package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.Verification;
import com.example.governmentsubsidy.enums.VerificationStage;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
    List<Verification> findByApplicationIdOrderByVerifiedAtDesc(Long applicationId);
    List<Verification> findByApplicationIdAndStage(Long applicationId, VerificationStage stage);
    List<Verification> findByVerifiedByUserId(Long userId);
}
