package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.dto.milestone.MilestoneResponse;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.service.AuthService;
import com.example.governmentsubsidy.service.MilestoneService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milestones")
public class MilestoneController {

    private final MilestoneService milestoneService;
    private final AuthService authService;

    public MilestoneController(MilestoneService milestoneService, AuthService authService) {
        this.milestoneService = milestoneService;
        this.authService = authService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MilestoneResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(milestoneService.getMilestoneById(id)));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<List<MilestoneResponse>>> getByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(ApiResponse.success(milestoneService.getMilestonesByApplication(applicationId)));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('FIELD_OFFICER', 'DISTRICT_OFFICER', 'FINANCE_OFFICER', 'ADMIN')")
    public ResponseEntity<ApiResponse<MilestoneResponse>> markComplianceSatisfied(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Compliance verified by inspecting officer") String remarks) {
        User currentUser = authService.getCurrentUser();
        MilestoneResponse response = milestoneService.markComplianceSatisfied(id, remarks, currentUser.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Milestone compliance verified and marked eligible for release", response));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('FINANCE_OFFICER', 'ADMIN', 'DISTRICT_OFFICER')")
    public ResponseEntity<ApiResponse<List<MilestoneResponse>>> getOverdueMilestones() {
        return ResponseEntity.ok(ApiResponse.success(milestoneService.getOverdueMilestones()));
    }
}
