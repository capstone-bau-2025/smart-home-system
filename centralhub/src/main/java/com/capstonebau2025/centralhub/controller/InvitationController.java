package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.AddUserRequest;
import com.capstonebau2025.centralhub.dto.AuthRequest;
import com.capstonebau2025.centralhub.dto.AuthResponse;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.service.auth.InvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class InvitationController {
    private final InvitationService invitationService;

    // POST /api/invitations?roleId=1
    @PostMapping
    public ResponseEntity<AuthResponse> generateInvitation(@RequestParam Long roleId) {
        String code = invitationService.generateInvitation(roleId);
        AuthResponse response = AuthResponse.builder()
                .token(code)
                .build();
        return ResponseEntity.ok(response);
    }
    // GET /api/invitations/validate?code=XYZ123
    @GetMapping("/validate")
    public ResponseEntity<Role> validateInvitation(@RequestParam String code) {
        Role role = invitationService.validateInvitation(code);
        return ResponseEntity.ok(role);
    }
}