package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.DeviceInfoDTO;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.service.SurveillanceService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
public class SurveillanceController {

    private final SurveillanceService surveillanceService;

    @GetMapping("/{id}/stream")
    public void streamCamera(@PathVariable Long id, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        surveillanceService.streamCameraFeed(userId, id, response);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<DeviceInfoDTO>> getStreamingDevices() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        List<DeviceInfoDTO> streamingDevices = surveillanceService.getStreamingDevices(userId);
        return ResponseEntity.ok(streamingDevices);
    }
    // TODO: update camera device python to update state to OFF after timer ends
}