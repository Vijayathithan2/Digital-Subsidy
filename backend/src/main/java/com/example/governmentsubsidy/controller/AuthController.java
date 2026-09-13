package com.example.governmentsubsidy.controller;

import com.example.governmentsubsidy.dto.auth.LoginRequest;
import com.example.governmentsubsidy.dto.auth.LoginResponse;
import com.example.governmentsubsidy.dto.auth.RegisterRequest;
import com.example.governmentsubsidy.dto.auth.UserResponse;
import com.example.governmentsubsidy.dto.common.ApiResponse;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        User user = authService.getCurrentUser();
        UserResponse response = authService.mapToUserResponse(user);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
