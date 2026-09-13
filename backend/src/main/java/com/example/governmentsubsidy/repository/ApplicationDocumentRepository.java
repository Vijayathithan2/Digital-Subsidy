package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.ApplicationDocument;
import com.example.governmentsubsidy.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, Long> {
    List<ApplicationDocument> findByApplicationId(Long applicationId);
    boolean existsByApplicationIdAndDocumentType(Long applicationId, DocumentType documentType);
}
