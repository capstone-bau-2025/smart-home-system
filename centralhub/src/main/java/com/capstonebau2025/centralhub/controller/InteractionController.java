package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.InteractionAreaDTO;
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
}
