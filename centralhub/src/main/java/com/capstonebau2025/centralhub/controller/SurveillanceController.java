package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.DeviceInfoDTO;
import com.capstonebau2025.centralhub.service.SurveillanceService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
public class SurveillanceController {

    private final SurveillanceService surveillanceService;

    @GetMapping("/{id}/stream")
    public void streamCamera(@PathVariable Long id, HttpServletResponse response) throws IOException {
        surveillanceService.streamCameraFeed(id, response);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<DeviceInfoDTO>> getStreamingDevices() {
        List<DeviceInfoDTO> streamingDevices = surveillanceService.getStreamingDevices();
        return ResponseEntity.ok(streamingDevices);
    }

    // TODO: Add method to get all cameras
    // TODO: update camera device python to update state to OFF after timer ends
}