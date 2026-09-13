package com.example.governmentsubsidy;

import com.example.governmentsubsidy.dto.auth.LoginRequest;
import com.example.governmentsubsidy.dto.auth.LoginResponse;
import com.example.governmentsubsidy.dto.auth.RegisterRequest;
import com.example.governmentsubsidy.dto.auth.UserResponse;
import com.example.governmentsubsidy.exception.BadRequestException;
import com.example.governmentsubsidy.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("Register new beneficiary user successfully")
    void testRegisterNewUser() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("new_applicant_" + System.currentTimeMillis());
        req.setPassword("Password@123");
        req.setFullName("Sunita Devi");
        req.setEmail("sunita_" + System.currentTimeMillis() + "@test.com");
        req.setPhone("+91 9988776655");
        req.setRoles(Set.of("ROLE_BENEFICIARY"));

        UserResponse res = authService.register(req);

        assertNotNull(res.getId());
        assertEquals(req.getUsername(), res.getUsername());
        assertTrue(res.getRoles().contains("ROLE_BENEFICIARY"));
        assertTrue(res.isEnabled());
    }

    @Test
    @DisplayName("Duplicate username registration throws BadRequestException")
    void testDuplicateUsernameThrowsBadRequest() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("admin"); // Already seeded
        req.setPassword("Password@123");
        req.setFullName("Duplicate User");
        req.setEmail("unique_email@test.com");

        assertThrows(BadRequestException.class, () -> authService.register(req));
    }

    @Test
    @DisplayName("Login with valid seed credentials returns JWT token")
    void testSuccessfulLogin() {
        LoginRequest req = new LoginRequest("admin", "Admin@123");

        LoginResponse res = authService.login(req);

        assertNotNull(res.getToken());
        assertFalse(res.getToken().isBlank());
        assertEquals("admin", res.getUsername());
        assertTrue(res.getRoles().contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Login with wrong password throws BadCredentialsException")
    void testWrongPasswordThrowsBadCredentials() {
        LoginRequest req = new LoginRequest("admin", "WrongPassword");

        assertThrows(BadCredentialsException.class, () -> authService.login(req));
    }
}
