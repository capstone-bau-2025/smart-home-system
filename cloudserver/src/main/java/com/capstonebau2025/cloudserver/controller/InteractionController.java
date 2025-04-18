package com.capstonebau2025.cloudserver.controller;


import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.dto.ExecuteCommandRequest;
import com.capstonebau2025.cloudserver.dto.UpdateStateRequest;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.HubAccessService;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
@Slf4j
public class InteractionController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;
    // TODO: rename hubId to hubSerialNumber in all endpoints
    @GetMapping
    public ResponseEntity<?> getAllInteractions(@RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            // Send command to hub to get all interactions
            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("GET_ALL_INTERACTIONS")
                    .email(user.getEmail())
                    .build();

            // Send command and wait for response (10 second timeout)
            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 10);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok(response.getPayload());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to get all interactions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to get interactions: " + e.getMessage());
        }
    }

    @PostMapping("/update-state")
    public ResponseEntity<?> updateStateInteraction(
            @RequestParam String hubSerialNumber,
            @RequestBody UpdateStateRequest dto) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
            // TODO: remove user email from the DTOs as it is not needed anymore since we get user from validation

            // Create and send command to hub
            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("UPDATE_STATE")
                    .email(user.getEmail())
                    .payload(dto)
                    .build();

            // Send command and wait for response (5 second timeout)
            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 5);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to update state", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update state: " + e.getMessage());
        }
    }

    @PostMapping("/execute-command")
    public ResponseEntity<?> executeCommand(
            @RequestParam String hubSerialNumber,
            @RequestBody ExecuteCommandRequest dto) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            // Create and send command to hub
            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("EXECUTE_COMMAND")
                    .email(user.getEmail())
                    .payload(dto)
                    .build();

            // Send command and wait for response (5 second timeout)
            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 5);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to execute command", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to execute command: " + e.getMessage());
        }
    }

    @GetMapping("/fetch-state/{stateValueId}")
    public ResponseEntity<?> fetchStateInteraction(
            @PathVariable Long stateValueId,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            // Create and send command to hub
            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("FETCH_STATE")
                    .email(user.getEmail())
                    .payload(stateValueId)
                    .build();

            // Send command and wait for response (5 second timeout)
            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 5);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok(response.getPayload());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to fetch state", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch state: " + e.getMessage());
        }
    }
}
