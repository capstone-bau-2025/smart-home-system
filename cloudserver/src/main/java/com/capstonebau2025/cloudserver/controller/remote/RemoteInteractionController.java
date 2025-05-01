package com.capstonebau2025.cloudserver.controller.remote;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.dto.ExecuteCommandRequest;
import com.capstonebau2025.cloudserver.dto.UpdateStateRequest;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.HubAccessService;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
@Tag(name = "remote-hub-control")
@Slf4j
public class RemoteInteractionController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;

    @GetMapping
    public ResponseEntity<?> getAllInteractions(@RequestParam String hubSerialNumber) {
        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        // Send command to hub to get all interactions
        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GET_ALL_INTERACTIONS")
                .email(user.getEmail())
                .build();

        // Send command and wait for response (10 second timeout)
        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 10);

        // If we reach here, it means the response was successful
        return ResponseEntity.ok(response.getPayload());
    }

    @PostMapping("/update-state")
    public ResponseEntity<?> updateStateInteraction(
            @RequestParam String hubSerialNumber,
            @RequestBody UpdateStateRequest dto) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        // Create and send command to hub
        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("UPDATE_STATE")
                .email(user.getEmail())
                .payload(dto)
                .build();

        // Send command and wait for response (5 second timeout)
        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        // If we reach here, it means the response was successful
        return ResponseEntity.ok().build();
    }

    @PostMapping("/execute-command")
    public ResponseEntity<?> executeCommand(
            @RequestParam String hubSerialNumber,
            @RequestBody ExecuteCommandRequest dto) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        // Create and send command to hub
        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("EXECUTE_COMMAND")
                .email(user.getEmail())
                .payload(dto)
                .build();

        // Send command and wait for response (5 second timeout)
        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        // If we reach here, it means the response was successful
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fetch-state/{stateValueId}")
    public ResponseEntity<?> fetchStateInteraction(
            @PathVariable Long stateValueId,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        // Create and send command to hub
        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("FETCH_STATE")
                .email(user.getEmail())
                .payload(stateValueId)
                .build();

        // Send command and wait for response (5 second timeout)
        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);

        // If we reach here, it means the response was successful
        return ResponseEntity.ok(response.getPayload());
    }
}
