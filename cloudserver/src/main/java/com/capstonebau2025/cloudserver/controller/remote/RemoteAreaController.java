package com.capstonebau2025.cloudserver.controller.remote;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.AuthorizationService;
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
@RequestMapping("/api/areas")
@RequiredArgsConstructor
@Slf4j
public class RemoteAreaController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;
    private final AuthorizationService authorizationService;

    @PostMapping("/add")
    public ResponseEntity<?> addArea(
            @RequestParam String areaName,
            @RequestParam Integer iconId,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        authorizationService.verifyAdminRole(user.getEmail(), hubSerialNumber);

        Map<String, Object> payload = new HashMap<>();
        payload.put("areaName", areaName);
        payload.put("iconId", iconId);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("ADD_AREA")
                .email(user.getEmail())
                .payload(payload)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

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

        return ResponseEntity.ok(response.getPayload());
    }

    @DeleteMapping("/{areaId}")
    public ResponseEntity<?> deleteArea(
            @PathVariable Long areaId,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        authorizationService.verifyAdminRole(user.getEmail(), hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("DELETE_AREA")
                .email(user.getEmail())
                .payload(areaId)
                .build();

        commandProcessor.processCommandAndWaitForResponse(hubSerialNumber, message, 5);
        return ResponseEntity.noContent().build();
    }
}
