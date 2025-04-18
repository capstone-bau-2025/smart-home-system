package com.capstonebau2025.cloudserver.controller;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.HubAccessService;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
@Slf4j
public class InvitationController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;

    @PostMapping
    public ResponseEntity<?> generateInvitation(
            @RequestParam Long roleId,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("GENERATE_INVITATION")
                    .email(user.getEmail())
                    .payload(roleId)
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
            log.error("Failed to generate invitation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to generate invitation: " + e.getMessage());
        }
    }
}
