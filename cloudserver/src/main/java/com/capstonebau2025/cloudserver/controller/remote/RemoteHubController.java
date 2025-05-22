package com.capstonebau2025.cloudserver.controller.remote;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.AuthorizationService;
import com.capstonebau2025.cloudserver.service.HubAccessService;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/hub")
@RequiredArgsConstructor
@Tag(name = "remote-hub-control")
@Slf4j
public class RemoteHubController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;
    private final AuthorizationService authorizationService;

    @PutMapping("/update-name")
    public ResponseEntity<Void> updateHubName(
            @RequestParam String name,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        authorizationService.verifyAdminRole(user.getEmail(), hubSerialNumber);

        Map<String, Object> payload = new HashMap<>();
        payload.put("name", name);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("UPDATE_HUB_NAME")
                .email(user.getEmail())
                .payload(payload)
                .build();

        commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        return ResponseEntity.noContent().build();
    }
}
