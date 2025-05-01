package com.capstonebau2025.cloudserver.controller.remote;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
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
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
@Tag(name = "remote-hub-control")
@Slf4j
public class RemoteInvitationController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;
    private final AuthorizationService authorizationService;

    @PostMapping
    public ResponseEntity<?> generateInvitation(
            @RequestParam Long roleId,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        authorizationService.verifyAdminRole(user.getEmail(), hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GENERATE_INVITATION")
                .email(user.getEmail())
                .payload(roleId)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        return ResponseEntity.ok(response.getPayload());
    }
}
