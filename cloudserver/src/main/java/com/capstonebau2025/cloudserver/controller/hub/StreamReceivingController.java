package com.capstonebau2025.cloudserver.controller.hub;

import com.capstonebau2025.cloudserver.service.RemoteStreamingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequestMapping("/api/streams")
@RequiredArgsConstructor
@Slf4j
public class StreamReceivingController {

    private final RemoteStreamingService remoteStreamingService;

    @PostMapping("/receive/{sessionId}")
    @SecurityRequirements()
    @Operation(summary = "HUB-only endpoint")
    public void receiveStream(@PathVariable String sessionId, HttpServletRequest request) throws IOException {
        log.info("Receiving stream for session {}", sessionId);
        // TODO: validate hub
        try {
            // Use the SAME thread to process the incoming stream until it's complete
            remoteStreamingService.receiveStreamFromHub(sessionId, request.getInputStream());
        } catch (Exception e) {
            log.error("Error processing stream: {}", e.getMessage(), e);
        }
        // No return value - the method will block until streaming is complete
    }
}