package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.localRequests.RegisterRequest;
import com.capstonebau2025.centralhub.dto.localRequests.AuthRequest;
import com.capstonebau2025.centralhub.dto.AuthResponse;
import com.capstonebau2025.centralhub.service.auth.AuthService;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @SecurityRequirements()
    public ResponseEntity<AuthResponse> registerWithInvitation(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/authenticate")
    @SecurityRequirements()
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}