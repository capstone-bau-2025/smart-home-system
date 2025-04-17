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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
@Slf4j
public class DeviceController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;

    @PutMapping("/{id}/name")
    public ResponseEntity<?> setDeviceName(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

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

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to set device name", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to set device name: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/area")
    public ResponseEntity<?> setDeviceArea(
            @PathVariable Long id,
            @RequestParam Long areaId,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

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

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to set device area", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to set device area: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/ping")
    public ResponseEntity<?> pingDevice(
            @PathVariable Long id,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("PING_DEVICE")
                    .email(user.getEmail())
                    .payload(id)
                    .build();

            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 10);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok(response.getPayload());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to ping device", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to ping device: " + e.getMessage());
        }
    }

    @GetMapping("/by-area/{areaId}")
    public ResponseEntity<?> getDevicesByArea(
            @PathVariable Long areaId,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("GET_DEVICES_BY_AREA")
                    .email(user.getEmail())
                    .payload(areaId)
                    .build();

            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 10);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.ok(response.getPayload());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to get devices by area", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to get devices by area: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDevice(
            @PathVariable Long id,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("DELETE_DEVICE")
                    .email(user.getEmail())
                    .payload(id)
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
            log.error("Failed to delete device", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete device: " + e.getMessage());
        }
    }
}
