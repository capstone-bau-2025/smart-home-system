package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.DeviceInfoDTO;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.service.SurveillanceService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
public class SurveillanceController {

    private final SurveillanceService surveillanceService;

    @GetMapping("/{id}/stream")
    @Operation(summary = "REMOTE")
    public void streamCamera(@PathVariable Long id,
                             @AuthenticationPrincipal User user,
                             HttpServletResponse response) {
        surveillanceService.streamCameraFeed(user.getId(), id, response);
    }

    @GetMapping("/get-all")
    @Operation(summary = "REMOTE")
    public ResponseEntity<List<DeviceInfoDTO>> getStreamingDevices(@AuthenticationPrincipal User user) {
        List<DeviceInfoDTO> streamingDevices = surveillanceService.getStreamingDevices(user.getId());
        return ResponseEntity.ok(streamingDevices);
    }
}