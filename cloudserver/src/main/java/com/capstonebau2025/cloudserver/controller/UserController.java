package com.capstonebau2025.cloudserver.controller;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.dto.UpdateUserPermissionsRequest;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.HubAccessService;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;

    @GetMapping("/roles")
    public ResponseEntity<?> getAllRoles(@RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("GET_ALL_ROLES")
                    .email(user.getEmail())
                    .build();

            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 5);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok(response.getPayload());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to get all roles", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to get all roles: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("GET_ALL_USERS")
                    .email(user.getEmail())
                    .build();

            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 5);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok(response.getPayload());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to get all users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to get all users: " + e.getMessage());
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long userId,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("DELETE_USER")
                    .email(user.getEmail())
                    .payload(userId)
                    .build();

            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 5);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to delete user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete user: " + e.getMessage());
        }
    }

    @PostMapping("/update-permissions")
    public ResponseEntity<?> updateUserPermissions(
            @RequestBody UpdateUserPermissionsRequest request,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("UPDATE_USER_PERMISSIONS")
                    .email(user.getEmail())
                    .payload(request)
                    .build();

            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 5);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to update user permissions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update user permissions: " + e.getMessage());
        }
    }
}
