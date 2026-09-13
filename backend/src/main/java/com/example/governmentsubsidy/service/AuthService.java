package com.example.governmentsubsidy.service;

import com.example.governmentsubsidy.dto.auth.LoginRequest;
import com.example.governmentsubsidy.dto.auth.LoginResponse;
import com.example.governmentsubsidy.dto.auth.RegisterRequest;
import com.example.governmentsubsidy.dto.auth.UserResponse;
import com.example.governmentsubsidy.entity.Role;
import com.example.governmentsubsidy.entity.User;
import com.example.governmentsubsidy.enums.RoleType;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.exception.ResourceNotFoundException;
import com.example.governmentsubsidy.exception.UnauthorizedException;
import com.example.governmentsubsidy.repository.RoleRepository;
import com.example.governmentsubsidy.repository.UserRepository;
import com.example.governmentsubsidy.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already registered");
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getEmail(),
                request.getPhone()
        );

        Set<Role> roles = new HashSet<>();
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByName(RoleType.ROLE_BENEFICIARY)
                    .orElseGet(() -> roleRepository.save(new Role(RoleType.ROLE_BENEFICIARY)));
            roles.add(defaultRole);
        } else {
            for (String roleStr : request.getRoles()) {
                String normalized = roleStr.toUpperCase();
                if (!normalized.startsWith("ROLE_")) {
                    normalized = "ROLE_" + normalized;
                }
                try {
                    RoleType roleType = RoleType.valueOf(normalized);
                    Role role = roleRepository.findByName(roleType)
                            .orElseGet(() -> roleRepository.save(new Role(roleType)));
                    roles.add(role);
                } catch (IllegalArgumentException e) {
                    throw new BadRequestException("Invalid role specified: " + roleStr);
                }
            }
        }
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        auditLogService.logAction(
                savedUser.getUsername(),
                "USER_REGISTERED",
                "User",
                savedUser.getId().toString(),
                null,
                "ACTIVE",
                "New user registered with roles: " + roles.stream().map(r -> r.getName().name()).toList()
        );

        return mapToUserResponse(savedUser);
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));

        String token = jwtService.generateToken(userDetails, user.getId(), user.getEmail());

        List<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        auditLogService.logAction(
                user.getUsername(),
                "USER_LOGIN",
                "User",
                user.getId().toString(),
                null,
                null,
                "User logged in successfully"
        );

        return new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                roleNames
        );
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("User is not authenticated");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found: " + username));
    }

    public UserResponse mapToUserResponse(User user) {
        List<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.isEnabled(),
                roleNames,
                user.getCreatedAt()
        );
    }
}
