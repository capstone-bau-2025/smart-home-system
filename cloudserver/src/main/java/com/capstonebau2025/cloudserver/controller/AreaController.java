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

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("ADD_AREA")
                .email(user.getEmail())
                .payload(areaName)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        // If we reach here, it means the response was successful
        // (errors are handled by RemoteCommandProcessor)
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response.getPayload());
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllAreas(@RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GET_ALL_AREAS")
                .email(user.getEmail())
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        // If we reach here, it means the response was successful
        return ResponseEntity.ok(response.getPayload());
    }

    @DeleteMapping("/{areaId}")
    public ResponseEntity<?> deleteArea(
            @PathVariable Long areaId,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("DELETE_AREA")
                .email(user.getEmail())
                .payload(areaId)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        // If we reach here, it means the response was successful
        return ResponseEntity.noContent().build();
    }
}
