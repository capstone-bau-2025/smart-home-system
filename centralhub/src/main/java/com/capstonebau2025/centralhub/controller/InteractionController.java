package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.CommandRequestDTO;
import com.capstonebau2025.centralhub.dto.InteractionAreaDTO;
import com.capstonebau2025.centralhub.dto.StateUpdateDTO;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.service.UserDeviceInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interaction")
@RequiredArgsConstructor
public class InteractionController {

    private final UserDeviceInteractionService interactionService;

    @GetMapping
    public ResponseEntity<InteractionAreaDTO[]> getAllInteractions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        return ResponseEntity.ok(interactionService.getAllInteractions(userId));
    }

    @PostMapping("/state")
    public ResponseEntity<Void> updateStateInteraction(@RequestBody StateUpdateDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        interactionService.updateStateInteraction(userId, dto.getStateValueId(), dto.getValue());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/command")
    public ResponseEntity<Void> executeCommand(@RequestBody CommandRequestDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        interactionService.commandInteraction(userId, dto.getDeviceId(), dto.getCommandId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/state/{stateValueId}")
    public ResponseEntity<String> fetchStateInteraction(@PathVariable Long stateValueId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        String stateValue = interactionService.fetchStateInteraction(userId, stateValueId);
        return ResponseEntity.ok(stateValue);
    }
}
