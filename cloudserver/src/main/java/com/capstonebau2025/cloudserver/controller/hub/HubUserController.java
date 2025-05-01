package com.capstonebau2025.cloudserver.controller.hub;

import com.capstonebau2025.cloudserver.dto.*;
import com.capstonebau2025.cloudserver.entity.Hub;
import com.capstonebau2025.cloudserver.service.HubService;
import com.capstonebau2025.cloudserver.service.LinkService;
import com.capstonebau2025.cloudserver.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/hub")
@RequiredArgsConstructor
public class HubUserController {
    private final UserService userService;
    private final LinkService linkService;
    private final HubService hubService;

    @PostMapping("/validateUser")
    @SecurityRequirements()
    @Operation(summary = "HUB-only endpoint")
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
    @SecurityRequirements()
    @Operation(summary = "HUB-only endpoint")
    public ResponseEntity<LinkUserResponse> linkUser(@RequestBody LinkUserRequest request) {
        Hub hub = hubService.getHubByToken(request.getToken());

        return linkService.linkUser(hub.getSerialNumber(), request.getEmail(), request.getCloudToken(), request.getRole());
    }

    @DeleteMapping("/unlinkUser")
    @SecurityRequirements()
    @Operation(summary = "HUB-only endpoint")
    public ResponseEntity<?> unlinkUser(@RequestBody UnlinkUserRequest request) {
        Hub hub = hubService.getHubByToken(request.getToken());

        linkService.unlinkUser(request.getEmail(), hub.getSerialNumber());
        log.info("Unlinked user with email: {} from hub with serial number: {}", request.getEmail(), hub.getSerialNumber());
        return ResponseEntity.ok().build();
    }
}
