package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.localRequests.ConfigureHubRequest;
import com.capstonebau2025.centralhub.dto.GetInvitationResponse;
import com.capstonebau2025.centralhub.dto.HubInfoResponse;
import com.capstonebau2025.centralhub.service.HubService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hub")
@RequiredArgsConstructor
public class HubController {
    private final HubService hubService;

    @GetMapping("/discover")
    @SecurityRequirements()
    public ResponseEntity<HubInfoResponse> discoverHub() {
        HubInfoResponse hubInfoResponse = hubService.getHubInfo();
        return ResponseEntity.ok(hubInfoResponse);
    }

    @PostMapping("/configure")
    @SecurityRequirements()
    public ResponseEntity<GetInvitationResponse> configureHub(@RequestBody ConfigureHubRequest request) {
        return ResponseEntity.ok(hubService.configureHub(request));
    }

    @PutMapping("/update-name")
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN, REMOTE")
    public ResponseEntity<Void> updateHubName(@RequestParam String name) {
        hubService.setHubName(name);
        return ResponseEntity.noContent().build();
    }
}
