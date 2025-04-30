package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.GetInvitationResponse;
import com.capstonebau2025.centralhub.service.auth.InvitationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.security.RolesAllowed;
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
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN, REMOTE")
    public ResponseEntity<GetInvitationResponse> generateInvitation(@RequestParam Long roleId) {
        return ResponseEntity.ok(invitationService.generateInvitation(roleId));
    }
}