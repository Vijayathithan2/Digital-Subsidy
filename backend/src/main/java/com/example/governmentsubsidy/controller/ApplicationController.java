package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.application.ApplicationRequest;
import com.example.governmentsubsidy.dto.application.ApplicationResponse;
import com.example.governmentsubsidy.dto.application.DocumentDto;
import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.dto.eligibility.EligibilityEvaluationResult;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.enums.ApplicationStatus;
import com.example.governmentsubsidy.enums.DocumentType;
import com.example.governmentsubsidy.service.ApplicationService;
import com.example.governmentsubsidy.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final AuthService authService;

    public ApplicationController(ApplicationService applicationService, AuthService authService) {
        this.applicationService = applicationService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationResponse>> createApplication(@Valid @RequestBody ApplicationRequest request) {
        User currentUser = authService.getCurrentUser();
        ApplicationResponse response = applicationService.createApplication(request, currentUser.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Application draft created successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<ApplicationResponse>> submitApplication(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        ApplicationResponse response = applicationService.submitApplication(id, currentUser.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Application submitted successfully", response));
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<ApiResponse<DocumentDto>> attachDocument(@PathVariable Long id,
                                                                   @RequestParam DocumentType documentType,
                                                                   @RequestParam String fileName,
                                                                   @RequestParam(defaultValue = "application/pdf") String fileType,
                                                                   @RequestParam String filePath) {
        User currentUser = authService.getCurrentUser();
        DocumentDto doc = applicationService.attachDocument(id, documentType, fileName, fileType, filePath, currentUser.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Document attached successfully", doc), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/evaluate-eligibility")
    public ResponseEntity<ApiResponse<EligibilityEvaluationResult>> evaluateEligibility(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        EligibilityEvaluationResult result = applicationService.evaluateEligibility(id, currentUser.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Eligibility evaluated successfully", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplicationById(@PathVariable Long id) {
        ApplicationResponse response = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getMyApplications() {
        User currentUser = authService.getCurrentUser();
        List<ApplicationResponse> list = applicationService.getApplicationsByUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER', 'FINANCE_OFFICER')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getAllApplications(
            @RequestParam(required = false) ApplicationStatus status) {
        List<ApplicationResponse> list = applicationService.getAllApplications(status);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
