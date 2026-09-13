package com.example.governmentsubsidy.repository;

import com.example.governmentsubsidy.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntityNameAndEntityIdOrderByTimestampDesc(String entityName, String entityId);
    List<AuditLog> findByUsernameOrderByTimestampDesc(String username);
    List<AuditLog> findAllByOrderByTimestampDesc();
}
