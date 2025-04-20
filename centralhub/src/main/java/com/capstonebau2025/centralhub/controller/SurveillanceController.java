package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.service.SurveillanceService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
public class SurveillanceController {

    private final SurveillanceService surveillanceService;

    @GetMapping("/{id}/stream")
    public void streamCamera(@PathVariable Long id, HttpServletResponse response) throws IOException {
        surveillanceService.streamCameraFeed(id, response);
    }

    // TODO: Add method to get all cameras
}