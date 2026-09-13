package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.audit.AuditLogResponse;
import com.example.governmentsubsidy.entity.AuditLog;
import com.example.governmentsubsidy.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public AuditLog logAction(String username, String action, String entityName, String entityId,
                              String previousState, String newState, String details) {
        AuditLog log = new AuditLog(
                username != null ? username : "SYSTEM",
                action,
                entityName,
                entityId,
                previousState,
                newState,
                details
        );
        return auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getLogsByEntity(String entityName, String entityId) {
        return auditLogRepository.findByEntityNameAndEntityIdOrderByTimestampDesc(entityName, entityId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getLogsByUser(String username) {
        return auditLogRepository.findByUsernameOrderByTimestampDesc(username).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getUsername(),
                log.getAction(),
                log.getEntityName(),
                log.getEntityId(),
                log.getPreviousState(),
                log.getNewState(),
                log.getDetails(),
                log.getTimestamp()
        );
    }
}
