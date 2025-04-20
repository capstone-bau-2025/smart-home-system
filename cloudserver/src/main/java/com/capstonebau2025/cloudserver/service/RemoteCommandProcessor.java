package com.capstonebau2025.cloudserver.service;

import com.capstonebau2025.cloudserver.dto.ErrorResponse;
import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.exception.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

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
            throw new CommunicationException("Failed to send command to hub: " + e.getMessage());
        }
    }

    // For synchronous requests where we want to wait for a response
    public RemoteCommandResponse processCommandAndWaitForResponse(String hubId, RemoteCommandMessage command, long timeoutSeconds) {
        // Set a UUID for correlating request and response
        String requestId = UUID.randomUUID().toString();
        command.setRequestId(requestId);

        // Create a future for this request
        CompletableFuture<RemoteCommandResponse> responseFuture = new CompletableFuture<>();
        pendingRequests.put(requestId, responseFuture);

        try {
            // Send the command
            processCommand(hubId, command);

            // Wait for response
            RemoteCommandResponse response = responseFuture.get(timeoutSeconds, TimeUnit.SECONDS);
            if (!"SUCCESS".equals(response.getStatus())) {
                handleErrorResponse(response); // This will throw the appropriate exception
            }
            return response;
        } catch (java.util.concurrent.TimeoutException e) {
            log.error("Timeout waiting for response from hub {}", hubId);
            throw new CommunicationException("Hub did not respond in time");
        } catch (ApplicationException e) {
            // Re-throw application-specific exceptions directly
            throw e;
        } catch (Exception e) {
            log.error("Error waiting for response to command {}: {}", command.getRequestId(), e.getMessage(), e);
            throw new CommunicationException("Failed to get response from hub");
        } finally {
            pendingRequests.remove(requestId);
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

    // Method to handle error responses and throw appropriate exceptions
    private void handleErrorResponse(RemoteCommandResponse response) {
        try {
            // Try to convert the payload to ErrorResponse
            ErrorResponse errorResponse;
            if (response.getPayload() instanceof Map) {
                log.debug("Processing payload: {}", response.getPayload());
                errorResponse = objectMapper.convertValue(response.getPayload(), ErrorResponse.class);
                log.debug("Converted to ErrorResponse: {}", errorResponse);
            } else {
                throw new Exception("Cannot convert payload to ErrorResponse: " + response.getPayload());
            }

            // Throw appropriate exception based on error type
            String errorType = errorResponse.getError();
            String errorMessage = errorResponse.getMessage();
            log.debug("Error type: {}, message: {}", errorType, errorMessage);

            switch (errorType) {
                case "ResourceNotFoundException":
                    throw new ResourceNotFoundException(errorMessage);
                case "ValidationException":
                    throw new ValidationException(errorMessage);
                case "AuthException":
                    throw new AuthException(errorMessage);
                case "UnauthorizedException":
                    throw new UnauthorizedException(errorMessage);
                case "DeviceConnectionException":
                    throw new DeviceConnectionException(errorMessage);
                case "CommunicationException":
                    throw new CommunicationException(errorMessage);
                default:
                    HttpStatus status = HttpStatus.valueOf(errorResponse.getStatus());
                    throw new ApplicationException(errorMessage, status);
            }
        } catch (ResourceNotFoundException | ValidationException | AuthException |
                 UnauthorizedException | DeviceConnectionException e) {
            // Re-throw these specific exceptions directly
            throw e;
        } catch (Exception e) {
            // If conversion fails, log and throw a generic communication exception
            log.error("Failed to process error response: {}", e.getMessage(), e);
            throw new CommunicationException("Error from hub: " + response.getMessage());
        }
    }
}
