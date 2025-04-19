package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.service.CameraStreamService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
public class CameraStreamController {

    private final CameraStreamService cameraStreamService;

    @GetMapping("/{id}/stream")
    public void streamCamera(@PathVariable String id, HttpServletResponse response) throws IOException {
        cameraStreamService.streamCameraFeed(id, response);
    }
}