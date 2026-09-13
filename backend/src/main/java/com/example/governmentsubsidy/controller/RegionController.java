package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.entity.Region;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.service.AuthService;
import com.example.governmentsubsidy.service.RegionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
public class RegionController {

    private final RegionService regionService;
    private final AuthService authService;

    public RegionController(RegionService regionService, AuthService authService) {
        this.regionService = regionService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Region>>> getAllRegions() {
        return ResponseEntity.ok(ApiResponse.success(regionService.getAllRegions()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Region>> getRegionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(regionService.getRegionById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Region>> createRegion(@RequestBody Region region) {
        User currentUser = authService.getCurrentUser();
        Region created = regionService.createRegion(region, currentUser.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Region created successfully", created), HttpStatus.CREATED);
    }
}
