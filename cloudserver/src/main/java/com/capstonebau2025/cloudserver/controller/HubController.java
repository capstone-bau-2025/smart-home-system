package com.capstonebau2025.cloudserver.controller;

import com.capstonebau2025.cloudserver.dto.HubRegistrationRequest;
import com.capstonebau2025.cloudserver.dto.UserValidationRequest;
import com.capstonebau2025.cloudserver.dto.UserValidationResponse;
import com.capstonebau2025.cloudserver.helper.KeyGenerator;
import com.capstonebau2025.cloudserver.entity.Hub;
import com.capstonebau2025.cloudserver.repository.HubRepository;
import com.capstonebau2025.cloudserver.service.LinkService;
import com.capstonebau2025.cloudserver.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.capstonebau2025.cloudserver.dto.LinkUserRequest;

@RestController
@RequestMapping("/api/hub")
@RequiredArgsConstructor
public class HubController {
    private final HubRepository hubRepository;
    private final UserService userService;
    private final LinkService hubService;

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
                .key(Long.valueOf(generatedKey))
                .location(request.getLocation())
                .name(request.getName())
                .build();

        hub = hubRepository.save(hub);

        return ResponseEntity.ok("Hub registered successfully with ID: " + hub.getId() + " and Key: " + generatedKey);
    }

    @PostMapping("/validateUser")
    public ResponseEntity<UserValidationResponse> validateUser(@RequestBody UserValidationRequest request) {
        if (request.getToken() == null || request.getToken().isEmpty()) {
            return ResponseEntity.badRequest().body(UserValidationResponse.builder()
                    .valid(false)
                    .message("Token is required")
                    .build());
        }

        UserValidationResponse response = userService.validateUser(request.getToken());
        return response.isValid()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(401).body(response);
    }


    @PostMapping("/linkUser")
    public ResponseEntity<?> linkUser(@RequestBody LinkUserRequest request) {
        return hubService.linkUser(request);
    }

}


