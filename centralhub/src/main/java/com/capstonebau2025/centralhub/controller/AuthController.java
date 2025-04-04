package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.AddUserRequest;
import com.capstonebau2025.centralhub.dto.AuthRequest;
import com.capstonebau2025.centralhub.dto.AuthResponse;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerWithInvitation(@RequestBody AddUserRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}