package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.analytics.DashboardAnalyticsResponse;
import com.example.governmentsubsidy.dto.analytics.RegionAnalyticsDto;
import com.example.governmentsubsidy.dto.analytics.SchemeAnalyticsDto;
import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_OFFICER', 'DISTRICT_OFFICER', 'FIELD_OFFICER')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardAnalyticsResponse>> getDashboard() {
        DashboardAnalyticsResponse response = analyticsService.getDashboardAnalytics();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/schemes")
    public ResponseEntity<ApiResponse<List<SchemeAnalyticsDto>>> getSchemeAnalytics() {
        List<SchemeAnalyticsDto> list = analyticsService.getSchemeAnalytics();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/regions")
    public ResponseEntity<ApiResponse<List<RegionAnalyticsDto>>> getRegionAnalytics() {
        List<RegionAnalyticsDto> list = analyticsService.getRegionAnalytics();
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
