package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.localRequests.ConfigureHubRequest;
import com.capstonebau2025.centralhub.dto.GetInvitationResponse;
import com.capstonebau2025.centralhub.dto.HubInfoResponse;
import com.capstonebau2025.centralhub.service.HubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hub")
@RequiredArgsConstructor
public class HubController {
    private final HubService hubService;

    @GetMapping("/discover")
    public ResponseEntity<HubInfoResponse> discoverHub() {
        HubInfoResponse hubInfoResponse = hubService.getHubInfo();
        return ResponseEntity.ok(hubInfoResponse);
    }

    @PostMapping("/Configure")
    public ResponseEntity<GetInvitationResponse> configureHub(@RequestBody ConfigureHubRequest request) {
        return ResponseEntity.ok(hubService.configureHub(request));
    }
}
