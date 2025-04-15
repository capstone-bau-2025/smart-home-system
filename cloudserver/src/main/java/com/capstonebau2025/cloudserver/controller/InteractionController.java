package com.capstonebau2025.cloudserver.controller;

import com.capstonebau2025.cloudserver.dto.AreaInteractionsDTO;
import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.ExecuteCommandRequest;
import com.capstonebau2025.cloudserver.dto.UpdateStateRequest;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.HubAccessService;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;
    @GetMapping
    public ResponseEntity<AreaInteractionsDTO[]> getAllInteractions(@RequestParam String hubId) {
        User user = hubAccessService.validateUserHubAccess(hubId);

        // Send command to hub to get all interactions
        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GET_ALL_INTERACTIONS")
                .email(user.getEmail())
                .build();

        commandProcessor.processCommand(hubId, message);

        // This would need to be implemented as a request-response pattern
        // For now, return an empty array
        return ResponseEntity.ok(new AreaInteractionsDTO[0]);
    }

    @PostMapping("/update-state")
    public ResponseEntity<Void> updateStateInteraction(
            @RequestParam String hubId,
            @RequestBody UpdateStateRequest dto) {
        User user = hubAccessService.validateUserHubAccess(hubId);

        // Create and send command to hub
        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("UPDATE_STATE")
                .email(user.getEmail())
                .payload(dto)
                .build();

        commandProcessor.processCommand(hubId, message);

        return ResponseEntity.accepted().build();
    }

    @PostMapping("/execute-command")
    public ResponseEntity<Void> executeCommand(
            @RequestParam String hubId,
            @RequestBody ExecuteCommandRequest dto) {
        User user = hubAccessService.validateUserHubAccess(hubId);

        // Create and send command to hub
        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("EXECUTE_COMMAND")
                .email(user.getEmail())
                .payload(dto)
                .build();

        commandProcessor.processCommand(hubId, message);

        return ResponseEntity.accepted().build();
    }

    @GetMapping("/fetch-state/{stateValueId}")
    public ResponseEntity<String> fetchStateInteraction(
            @PathVariable Long stateValueId,
            @RequestParam String hubId) {
        User user = hubAccessService.validateUserHubAccess(hubId);

        // Create and send command to hub
        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("FETCH_STATE")
                .email(user.getEmail())
                .payload(stateValueId)
                .build();

        commandProcessor.processCommand(hubId, message);

        // This would need to be implemented as a request-response pattern
        // For now, return a placeholder
        return ResponseEntity.ok("Pending");
    }
}
