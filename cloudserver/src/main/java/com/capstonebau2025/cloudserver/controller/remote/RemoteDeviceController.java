package com.capstonebau2025.cloudserver.controller.remote;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.AuthorizationService;
import com.capstonebau2025.cloudserver.service.HubAccessService;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
@Slf4j
public class RemoteDeviceController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;
    private final AuthorizationService authorizationService;

    @PutMapping("/{id}/name")
    public ResponseEntity<?> setDeviceName(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        authorizationService.verifyAdminRole(user.getEmail(), hubSerialNumber);

        Map<String, Object> payload = new HashMap<>();
        payload.put("deviceId", id);
        payload.put("name", name);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("SET_DEVICE_NAME")
                .email(user.getEmail())
                .payload(payload)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/area")
    public ResponseEntity<?> setDeviceArea(
            @PathVariable Long id,
            @RequestParam Long areaId,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        authorizationService.verifyAdminRole(user.getEmail(), hubSerialNumber);

        Map<String, Object> payload = new HashMap<>();
        payload.put("deviceId", id);
        payload.put("areaId", areaId);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("SET_DEVICE_AREA")
                .email(user.getEmail())
                .payload(payload)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/ping")
    public ResponseEntity<?> pingDevice(
            @PathVariable Long id,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("PING_DEVICE")
                .email(user.getEmail())
                .payload(id)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 10);

        return ResponseEntity.ok(response.getPayload());
    }

    @GetMapping("/by-area/{areaId}")
    public ResponseEntity<?> getDevicesByArea(
            @PathVariable Long areaId,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GET_DEVICES_BY_AREA")
                .email(user.getEmail())
                .payload(areaId)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 10);

        return ResponseEntity.ok(response.getPayload());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDevice(
            @PathVariable Long id,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        authorizationService.verifyAdminRole(user.getEmail(), hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("DELETE_DEVICE")
                .email(user.getEmail())
                .payload(id)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        return ResponseEntity.noContent().build();
    }
}
