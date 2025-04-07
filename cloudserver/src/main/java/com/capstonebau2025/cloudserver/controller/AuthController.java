package com.capstonebau2025.cloudserver.controller;

import com.capstonebau2025.cloudserver.dto.AuthRequest;
import com.capstonebau2025.cloudserver.dto.AuthResponse;
import com.capstonebau2025.cloudserver.dto.RegisterRequest;
import com.capstonebau2025.cloudserver.service.AuthService;
import com.capstonebau2025.cloudserver.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
    @PostMapping("/hub-token")
    public ResponseEntity<Map<String, String>> getHubToken(@RequestBody Map<String, String> request) {
        String hubId = request.get("hubId");
        // In production, validate the hubId against authorized hubs

        String token = jwtService.generateHubToken(hubId);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }
}