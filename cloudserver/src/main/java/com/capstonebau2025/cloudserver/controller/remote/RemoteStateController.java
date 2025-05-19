package com.capstonebau2025.cloudserver.controller.remote;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.entity.User;
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
@RequestMapping("/api/states")
@RequiredArgsConstructor
@Tag(name = "remote-hub-control")
@Slf4j
public class RemoteStateController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<?> getStatesByDeviceId(
            @PathVariable Long deviceId,
            @RequestParam(required = false, defaultValue = "ALL") String filter,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        // Create a payload containing both deviceId and filter
        Map<String, Object> payload = new HashMap<>();
        payload.put("deviceId", deviceId);
        payload.put("filter", filter);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GET_STATES_BY_DEVICE")
                .email(user.getEmail())
                .payload(payload)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 10);

        return ResponseEntity.ok(response.getPayload());
    }
}