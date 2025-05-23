package com.capstonebau2025.cloudserver.controller.hub;

import com.capstonebau2025.cloudserver.dto.NotificationRequest;
import com.capstonebau2025.cloudserver.entity.Hub;
import com.capstonebau2025.cloudserver.service.FCMService;
import com.capstonebau2025.cloudserver.service.HubService;
import com.google.firebase.messaging.FirebaseMessagingException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notify")
public class NotificationController {

    private final HubService hubService;
    private final FCMService fcmService;

    @PostMapping
    @SecurityRequirements()
    @Operation(summary = "HUB-only endpoint")
    public ResponseEntity<?> send(@RequestBody NotificationRequest request) {

        Hub hub = hubService.getHubByToken(request.getToken());
        if(!hubService.isUserLinkedToHub(hub.getSerialNumber(), request.getEmail()))
            throw new RuntimeException("User is not linked to this hub");

        try {
            String response = fcmService.sendNotification(
                request.getEmail(), request.getTitle(), request.getBody());

            return ResponseEntity.ok("Notification sent: " + response);

        } catch (FirebaseMessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error sending notification: " + e.getMessage());
        }
    }
}
