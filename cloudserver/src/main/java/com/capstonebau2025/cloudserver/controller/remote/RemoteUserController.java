package com.capstonebau2025.cloudserver.controller.remote;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.dto.UpdateUserPermissionsRequest;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.AuthorizationService;
import com.capstonebau2025.cloudserver.service.HubAccessService;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(
    name = "remote-hub-control",
    description = "Endpoints that forward requests to the hub for processing. They mirror hub endpoints but require an additional hubSerialNumber request parameter."
)
@Slf4j
public class RemoteUserController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;
    private final AuthorizationService authorizationService;

    @GetMapping("/roles")
    public ResponseEntity<?> getAllRoles(@RequestParam String hubSerialNumber) {
        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);


        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GET_ALL_ROLES")
                .email(user.getEmail())
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        return ResponseEntity.ok(response.getPayload());
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestParam String hubSerialNumber) {
        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);


        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GET_ALL_USERS")
                .email(user.getEmail())
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        return ResponseEntity.ok(response.getPayload());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long userId,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        authorizationService.verifyAdminRole(user.getEmail(), hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("DELETE_USER")
                .email(user.getEmail())
                .payload(userId)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/update-permissions")
    public ResponseEntity<?> updateUserPermissions(
            @RequestBody UpdateUserPermissionsRequest request,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        authorizationService.verifyAdminRole(user.getEmail(), hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("UPDATE_USER_PERMISSIONS")
                .email(user.getEmail())
                .payload(request)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/permissions")
    public ResponseEntity<?> getUserPermissions(
            @PathVariable Long userId,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        authorizationService.verifyAdminRole(user.getEmail(), hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GET_USER_PERMISSIONS")
                .email(user.getEmail())
                .payload(userId)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        return ResponseEntity.ok(response.getPayload());
    }
}
