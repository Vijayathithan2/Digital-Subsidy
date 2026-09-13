package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.Beneficiary;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.enums.BeneficiaryCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    Optional<Beneficiary> findByUser(User user);
    Optional<Beneficiary> findByUserId(Long userId);
    Optional<Beneficiary> findByIdentityNumber(String identityNumber);
    boolean existsByIdentityNumber(String identityNumber);
    List<Beneficiary> findByRegionId(Long regionId);
    List<Beneficiary> findByCategory(BeneficiaryCategory category);
    long countByCategory(BeneficiaryCategory category);
}
