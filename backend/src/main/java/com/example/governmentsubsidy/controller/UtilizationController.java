package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.dto.utilization.UtilizationRequest;
import com.example.governmentsubsidy.dto.utilization.UtilizationResponse;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.service.AuthService;
import com.example.governmentsubsidy.service.FundUtilizationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilizations")
public class UtilizationController {

    private final FundUtilizationService utilizationService;
    private final AuthService authService;

    public UtilizationController(FundUtilizationService utilizationService, AuthService authService) {
        this.utilizationService = utilizationService;
        this.authService = authService;
    }

    @PostMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<UtilizationResponse>> submitUtilization(
            @PathVariable Long applicationId,
            @Valid @RequestBody UtilizationRequest request) {
        User user = authService.getCurrentUser();
        UtilizationResponse response = utilizationService.submitUtilization(applicationId, request, user);
        return new ResponseEntity<>(ApiResponse.success("Fund utilization submitted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<List<UtilizationResponse>>> getUtilizationsByApplication(
            @PathVariable Long applicationId) {
        List<UtilizationResponse> list = utilizationService.getUtilizationsByApplication(applicationId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('FIELD_OFFICER', 'DISTRICT_OFFICER', 'FINANCE_OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<UtilizationResponse>> verifyUtilization(
            @PathVariable Long id,
            @RequestParam boolean approved,
            @RequestParam(required = false) String remarks) {
        User officer = authService.getCurrentUser();
        UtilizationResponse response = utilizationService.verifyUtilization(id, approved, remarks, officer);
        return ResponseEntity.ok(ApiResponse.success("Utilization verification recorded", response));
    }
}
