package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.audit.AuditLogResponse;
import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {

    private final AuditLogService auditLogService;

    public AuditController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAllAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success(auditLogService.getAllAuditLogs()));
    }

    @GetMapping("/entity/{name}/{id}")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getByEntity(
            @PathVariable String name,
            @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(auditLogService.getLogsByEntity(name, id)));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getByUser(@PathVariable String username) {
        return ResponseEntity.ok(ApiResponse.success(auditLogService.getLogsByUser(username)));
    }
}
