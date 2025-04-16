package com.capstonebau2025.cloudserver.service;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

//import javax.annotation.PostConstruct;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class RemoteCommandProcessor {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    // Store for request-response correlation
    private final Map<String, CompletableFuture<RemoteCommandResponse>> pendingRequests = new ConcurrentHashMap<>();

    public void processCommand(String hubId, RemoteCommandMessage command) {
        try {
            // Generate request ID if not present
            if (command.getRequestId() == null) {
                command.setRequestId(UUID.randomUUID().toString());
            }

            String destination = "/topic/commands/" + hubId;
            log.info("Sending command to hub {}: {}", hubId, command);
            messagingTemplate.convertAndSend(destination, command);
        } catch (Exception e) {
            log.error("Error processing command for hub {}: {}", hubId, e.getMessage(), e);
            throw new RuntimeException("Failed to process command", e);
        }
    }

    // For synchronous requests where we want to wait for a response
    public RemoteCommandResponse processCommandAndWaitForResponse(String hubId, RemoteCommandMessage command, long timeoutSeconds) {
        try {
            // Set a UUID for correlating request and response
            String requestId = UUID.randomUUID().toString();
            command.setRequestId(requestId);

            // Create a future for this request
            CompletableFuture<RemoteCommandResponse> responseFuture = new CompletableFuture<>();
            pendingRequests.put(requestId, responseFuture);

            // Send the command
            processCommand(hubId, command);

            // Wait for response
            try {
                return responseFuture.get(timeoutSeconds, TimeUnit.SECONDS);
            } catch (Exception e) {
                log.error("Error waiting for response to command {}: {}", requestId, e.getMessage());
                throw new RuntimeException("Failed to get response from hub", e);
            } finally {
                pendingRequests.remove(requestId);
            }
        } catch (Exception e) {
            log.error("Error in processCommandAndWaitForResponse: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process command", e);
        }
    }

    // Called by HubResponseHandler when a response is received
    public void handleResponse(RemoteCommandResponse response) {
        String requestId = response.getRequestId();
        if (requestId != null && pendingRequests.containsKey(requestId)) {
            CompletableFuture<RemoteCommandResponse> future = pendingRequests.get(requestId);
            future.complete(response);
        }
    }
}
