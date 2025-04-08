package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.AuthResponse;
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
}