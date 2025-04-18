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
@RequestMapping("/api/areas")
@RequiredArgsConstructor
@Slf4j
public class AreaController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;

    @PostMapping("/add")
    public ResponseEntity<?> addArea(
            @RequestParam String areaName,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("ADD_AREA")
                    .email(user.getEmail())
                    .payload(areaName)
                    .build();

            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 5);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(response.getPayload());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to add area", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add area: " + e.getMessage());
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllAreas(@RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("GET_ALL_AREAS")
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
            log.error("Failed to get all areas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to get all areas: " + e.getMessage());
        }
    }

    @DeleteMapping("/{areaId}")
    public ResponseEntity<?> deleteArea(
            @PathVariable Long areaId,
            @RequestParam String hubSerialNumber) {
        try {
            User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

            RemoteCommandMessage message = RemoteCommandMessage.builder()
                    .commandType("DELETE_AREA")
                    .email(user.getEmail())
                    .payload(areaId)
                    .build();

            RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                    hubSerialNumber, message, 5);

            if ("SUCCESS".equals(response.getStatus())) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: " + response.getMessage());
            }
        } catch (Exception e) {
            log.error("Failed to delete area", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete area: " + e.getMessage());
        }
    }
}
