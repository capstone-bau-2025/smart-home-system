package com.capstonebau2025.cloudserver.controller;

import com.capstonebau2025.cloudserver.dto.*;
import com.capstonebau2025.cloudserver.helper.KeyGenerator;
import com.capstonebau2025.cloudserver.entity.Hub;
import com.capstonebau2025.cloudserver.repository.HubRepository;
import com.capstonebau2025.cloudserver.service.HubService;
import com.capstonebau2025.cloudserver.service.JwtService;
import com.capstonebau2025.cloudserver.service.LinkService;
import com.capstonebau2025.cloudserver.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/hub")
@RequiredArgsConstructor
public class HubController {
    private final HubRepository hubRepository;
    private final UserService userService;
    private final LinkService linkService;
    private final HubService hubService;
    private final JwtService jwtService;

    @PostMapping("/registerHub")
    public ResponseEntity<?> registerHub(@RequestBody HubRegistrationRequest request) {
        // Check if the hub already exists
        if (hubRepository.findBySerialNumber(request.getSerialNumber()).isPresent()) {
            return ResponseEntity.badRequest().body("Hub with this serial number already exists.");
        }

        // Generate a secure key for the hub
        String generatedKey = KeyGenerator.generateKey();

        // Create and save the new Hub entity
        Hub hub = Hub.builder()
                .serialNumber(request.getSerialNumber())
                .key(generatedKey)
                .location(request.getLocation())
                .name(request.getName())
                .build();

        hub = hubRepository.save(hub);

        HubRegistrationResponse response = HubRegistrationResponse.builder()
                .serialNumber(hub.getSerialNumber())
                .location(hub.getLocation())
                .key(generatedKey)
                .name(hub.getName())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/hub-token")
    public ResponseEntity<Map<String, String>> getHubToken(@RequestBody GetTokenRequest request) {
        Hub hub = hubRepository.findBySerialNumber(request.getSerialNumber())
                .orElseThrow(() -> new IllegalArgumentException("Hub not registered to cloud"));
        if(!hub.getKey().equals(request.getKey())) {
            throw new IllegalArgumentException("Invalid key");
        }
        String token = jwtService.generateHubToken(request.getSerialNumber());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/validateUser")
    public ResponseEntity<UserValidationResponse> validateUser(@RequestBody UserValidationRequest request) {

        if(!hubService.hubExistsByToken(request.getToken())) {
            return ResponseEntity.status(401).body(UserValidationResponse.builder()
                    .valid(false)
                    .message("Invalid hub token")
                    .build());
        }

        UserValidationResponse response = userService.validateUser(request.getCloudToken(), request.getEmail());
        return response.isValid()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(401).body(response);
    }

    @PostMapping("/linkUser")
    public ResponseEntity<LinkUserResponse> linkUser(@RequestBody LinkUserRequest request) {
        Hub hub = hubService.getHubByToken(request.getToken());

        return linkService.linkUser(hub.getSerialNumber(), request.getEmail(), request.getCloudToken());
    }

    @DeleteMapping("/unlinkUser")
    public ResponseEntity<?> unlinkUser(@RequestBody UnlinkUserRequest request) {
        Hub hub = hubService.getHubByToken(request.getToken());

        linkService.unlinkUser(request.getEmail(), hub.getSerialNumber());
        log.info("Unlinked user with email: {} from hub with serial number: {}", request.getEmail(), hub.getSerialNumber());
        return ResponseEntity.ok().build();
    }
}

