package com.capstonebau2025.cloudserver.controller;

import com.capstonebau2025.cloudserver.dto.HubRegistrationRequest;
import com.capstonebau2025.cloudserver.helper.KeyGenerator;
import com.capstonebau2025.cloudserver.entity.Hub;
import com.capstonebau2025.cloudserver.repository.HubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hub")
@RequiredArgsConstructor
public class HubController {
    private final HubRepository hubRepository;
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
                .build();

        hub = hubRepository.save(hub);

        return ResponseEntity.ok("Hub registered successfully with ID: " + hub.getId() + " and Key: " + generatedKey);
    }

    @PostMapping("/validateUser")
    public ResponseEntity<String> validateUser(@RequestBody String token) {

       /*
        * TODO: Implement validating user
        * this method should allow a hub to make sure that a user is valid by its token,
        * can be the default user JWT token or the special token (yet to be decided),
        * this method should be used in hub setup & adding new user to the hub.
        */

        return ResponseEntity.ok("User is valid");
    }

    @PostMapping("/linkUser")
    public ResponseEntity<String> linkUser(@RequestBody String token) {

       /*
        * TODO: Implement linking user
        * this method should allow a hub to link a user to it by its token,
        * can be the default user JWT token or the special token (yet to be decided),
        * this method should be used in hub setup & adding new user to the hub.
        */

        return ResponseEntity.ok("User is linked");
    }
}




