package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.dto.scheme.SchemeRequest;
import com.example.governmentsubsidy.dto.scheme.SchemeResponse;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.service.AuthService;
import com.example.governmentsubsidy.service.SchemeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {

    private final SchemeService schemeService;
    private final AuthService authService;

    public SchemeController(SchemeService schemeService, AuthService authService) {
        this.schemeService = schemeService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchemeResponse>>> getAllSchemes() {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getAllSchemes()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SchemeResponse>>> getActiveSchemes() {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getActiveSchemes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SchemeResponse>> getSchemeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(schemeService.getSchemeById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SchemeResponse>> createScheme(@Valid @RequestBody SchemeRequest request) {
        User currentUser = authService.getCurrentUser();
        SchemeResponse created = schemeService.createScheme(request, currentUser.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Scheme created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SchemeResponse>> updateScheme(@PathVariable Long id,
                                                                   @Valid @RequestBody SchemeRequest request) {
        User currentUser = authService.getCurrentUser();
        SchemeResponse updated = schemeService.updateScheme(id, request, currentUser.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Scheme updated successfully", updated));
    }
}
