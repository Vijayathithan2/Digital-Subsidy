package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.dto.disbursement.DisbursementPlanRequest;
import com.example.governmentsubsidy.dto.disbursement.DisbursementPlanResponse;
import com.example.governmentsubsidy.dto.disbursement.FundReleaseRequest;
import com.example.governmentsubsidy.dto.disbursement.FundReleaseResponse;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.service.AuthService;
import com.example.governmentsubsidy.service.DisbursementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/disbursements")
public class DisbursementController {

    private final DisbursementService disbursementService;
    private final AuthService authService;

    public DisbursementController(DisbursementService disbursementService, AuthService authService) {
        this.disbursementService = disbursementService;
        this.authService = authService;
    }

    @PostMapping("/plan")
    @PreAuthorize("hasAnyRole('FINANCE_OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<DisbursementPlanResponse>> createPlan(
            @Valid @RequestBody DisbursementPlanRequest request) {
        User currentUser = authService.getCurrentUser();
        DisbursementPlanResponse response = disbursementService.createDisbursementPlan(request, currentUser.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Disbursement plan created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<DisbursementPlanResponse>> getPlanByApplication(@PathVariable Long applicationId) {
        DisbursementPlanResponse response = disbursementService.getPlanByApplicationId(applicationId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/milestones/{milestoneId}/release")
    @PreAuthorize("hasAnyRole('FINANCE_OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<FundReleaseResponse>> releaseMilestoneFunds(
            @PathVariable Long milestoneId,
            @Valid @RequestBody FundReleaseRequest request) {
        User officer = authService.getCurrentUser();
        FundReleaseResponse response = disbursementService.releaseMilestoneFunds(milestoneId, request, officer);
        return ResponseEntity.ok(ApiResponse.success("Fund released successfully via Treasury DBT", response));
    }
}
