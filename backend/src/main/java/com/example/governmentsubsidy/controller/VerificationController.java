package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.dto.verification.VerificationRequest;
import com.example.governmentsubsidy.dto.verification.VerificationResponse;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.service.AuthService;
import com.example.governmentsubsidy.service.VerificationWorkflowService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/verifications")
public class VerificationController {

    private final VerificationWorkflowService workflowService;
    private final AuthService authService;

    public VerificationController(VerificationWorkflowService workflowService, AuthService authService) {
        this.workflowService = workflowService;
        this.authService = authService;
    }

    @PostMapping("/field/{applicationId}")
    @PreAuthorize("hasAnyRole('FIELD_OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<VerificationResponse>> fieldVerification(
            @PathVariable Long applicationId,
            @Valid @RequestBody VerificationRequest request) {
        User officer = authService.getCurrentUser();
        VerificationResponse response = workflowService.performFieldVerification(applicationId, request, officer);
        return ResponseEntity.ok(ApiResponse.success("Field verification completed", response));
    }

    @PostMapping("/district/{applicationId}")
    @PreAuthorize("hasAnyRole('DISTRICT_OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<VerificationResponse>> districtReview(
            @PathVariable Long applicationId,
            @Valid @RequestBody VerificationRequest request) {
        User officer = authService.getCurrentUser();
        VerificationResponse response = workflowService.performDistrictReview(applicationId, request, officer);
        return ResponseEntity.ok(ApiResponse.success("District review completed", response));
    }

    @PostMapping("/finance/{applicationId}")
    @PreAuthorize("hasAnyRole('FINANCE_OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<VerificationResponse>> financeApproval(
            @PathVariable Long applicationId,
            @RequestParam(required = false) BigDecimal approvedAmount,
            @Valid @RequestBody VerificationRequest request) {
        User officer = authService.getCurrentUser();
        VerificationResponse response = workflowService.performFinanceApproval(applicationId, approvedAmount, request, officer);
        return ResponseEntity.ok(ApiResponse.success("Finance review completed", response));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<List<VerificationResponse>>> getVerificationsByApplication(@PathVariable Long applicationId) {
        List<VerificationResponse> history = workflowService.getVerificationsForApplication(applicationId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
