package com.capstonebau2025.cloudserver.controller.remote;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.HubAccessService;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import com.capstonebau2025.cloudserver.service.RemoteStreamingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/cameras")
@RequiredArgsConstructor
@Tag(name = "remote-hub-control")
@Slf4j
public class RemoteSurveillanceController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;
    private final RemoteStreamingService remoteStreamingService;

    @GetMapping("/{id}/stream")
    public void streamCamera(
            @PathVariable Long id,
            @RequestParam String hubSerialNumber,
            HttpServletResponse response) {
        
        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        
        // Create a streaming session between hub and cloud
        String streamSessionId = remoteStreamingService.initiateStreamSession(hubSerialNumber, id, user.getEmail());
        
        // Notify the hub to start streaming with the session ID
        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("INITIATE_CAMERA_STREAM")
                .email(user.getEmail())
                .payload(new CameraStreamRequest(id, streamSessionId))
                .build();
        
        // Send command to hub (not waiting for response as streaming is handled separately)
        commandProcessor.processCommand(hubSerialNumber, message);
        
        // Stream from cloud to client
        remoteStreamingService.streamToClient(streamSessionId, response);
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getStreamingDevices(@RequestParam String hubSerialNumber) {
        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);
        
        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GET_STREAMING_DEVICES")
                .email(user.getEmail())
                .build();
        
        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 5);
        
        return ResponseEntity.ok(response.getPayload());
    }
    
    // Inner class for camera stream request
    @Getter
    @RequiredArgsConstructor
    private static class CameraStreamRequest {
        private final Long cameraId;
        private final String sessionId;
    }
}