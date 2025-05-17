package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.RemoteRequests.ExecuteCommandRequest;
import com.capstonebau2025.centralhub.dto.AreaInteractionsDTO;
import com.capstonebau2025.centralhub.dto.RemoteRequests.UpdateStateRequest;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.service.UserDeviceInteractionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final UserDeviceInteractionService interactionService;

    @GetMapping
    @Operation(summary = "REMOTE")
    public ResponseEntity<AreaInteractionsDTO[]> getAllInteractions(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(interactionService.getAllInteractions(user.getId()));
    }

    @PostMapping("/update-state")
    @Operation(summary = "REMOTE")
    public ResponseEntity<Void> updateStateInteraction(@RequestBody UpdateStateRequest dto,
                                                       @AuthenticationPrincipal User user) {
        interactionService.updateStateInteraction(user.getId(), dto.getStateValueId(), dto.getValue());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/execute-command")
    @Operation(summary = "REMOTE")
    public ResponseEntity<Void> executeCommand(@RequestBody ExecuteCommandRequest dto,
                                               @AuthenticationPrincipal User user) {
        interactionService.commandInteraction(user.getId(), dto.getDeviceId(), dto.getCommandId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fetch-state/{stateValueId}")
    @Operation(summary = "REMOTE")
    public ResponseEntity<String> fetchStateInteraction(@PathVariable Long stateValueId,
                                                        @AuthenticationPrincipal User user) {
        String stateValue = interactionService.fetchStateInteraction(user.getId(), stateValueId);
        return ResponseEntity.ok(stateValue);
    }
}
