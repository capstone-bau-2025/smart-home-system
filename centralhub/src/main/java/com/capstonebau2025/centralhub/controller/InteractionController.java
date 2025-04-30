package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.RemoteRequests.ExecuteCommandRequest;
import com.capstonebau2025.centralhub.dto.AreaInteractionsDTO;
import com.capstonebau2025.centralhub.dto.RemoteRequests.UpdateStateRequest;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.service.UserDeviceInteractionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final UserDeviceInteractionService interactionService;

    @GetMapping
    @Operation(summary = "REMOTE")
    public ResponseEntity<AreaInteractionsDTO[]> getAllInteractions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        return ResponseEntity.ok(interactionService.getAllInteractions(userId));
    }

    @PostMapping("/update-state")
    @Operation(summary = "REMOTE")
    public ResponseEntity<Void> updateStateInteraction(@RequestBody UpdateStateRequest dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        interactionService.updateStateInteraction(userId, dto.getStateValueId(), dto.getValue());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/execute-command")
    @Operation(summary = "REMOTE")
    public ResponseEntity<Void> executeCommand(@RequestBody ExecuteCommandRequest dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        interactionService.commandInteraction(userId, dto.getDeviceId(), dto.getCommandId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/fetch-state/{stateValueId}")
    @Operation(summary = "REMOTE")
    public ResponseEntity<String> fetchStateInteraction(@PathVariable Long stateValueId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        String stateValue = interactionService.fetchStateInteraction(userId, stateValueId);
        return ResponseEntity.ok(stateValue);
    }
}
