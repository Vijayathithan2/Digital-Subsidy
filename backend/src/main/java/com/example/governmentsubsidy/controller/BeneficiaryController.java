package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.beneficiary.BeneficiaryRequest;
import com.example.governmentsubsidy.dto.beneficiary.BeneficiaryResponse;
import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.enums.KycStatus;
import com.example.governmentsubsidy.service.AuthService;
import com.example.governmentsubsidy.service.BeneficiaryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;
    private final AuthService authService;

    public BeneficiaryController(BeneficiaryService beneficiaryService, AuthService authService) {
        this.beneficiaryService = beneficiaryService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> registerProfile(@Valid @RequestBody BeneficiaryRequest request) {
        User currentUser = authService.getCurrentUser();
        BeneficiaryResponse response = beneficiaryService.registerBeneficiaryProfile(currentUser, request);
        return new ResponseEntity<>(ApiResponse.success("Beneficiary profile registered successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> getMyProfile() {
        User currentUser = authService.getCurrentUser();
        BeneficiaryResponse response = beneficiaryService.getMyBeneficiaryProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER', 'FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(beneficiaryService.getBeneficiaryById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER', 'FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<List<BeneficiaryResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(beneficiaryService.getAllBeneficiaries()));
    }

    @PatchMapping("/{id}/kyc")
    @PreAuthorize("hasAnyRole('ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER')")
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> updateKyc(@PathVariable Long id, @RequestParam KycStatus status) {
        User currentUser = authService.getCurrentUser();
        BeneficiaryResponse response = beneficiaryService.updateKycStatus(id, status, currentUser.getUsername());
        return ResponseEntity.ok(ApiResponse.success("KYC status updated to " + status, response));
    }
}
