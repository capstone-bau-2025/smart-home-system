package com.capstonebau2025.centralhub.client;

import com.capstonebau2025.centralhub.dto.RemoteCommandMessage;
import com.capstonebau2025.centralhub.dto.RemoteCommandResponse;
import com.capstonebau2025.centralhub.dto.RemoteRequests.ExecuteCommandRequest;
import com.capstonebau2025.centralhub.dto.RemoteRequests.UpdateStateRequest;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.repository.UserRepository;
import com.capstonebau2025.centralhub.service.UserDeviceInteractionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketCommandHandler {

    private final UserDeviceInteractionService interactionService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    // Reference to the active WebSocket client session
    private StompSession stompSession;

    // Method to set the session from WebSocketClient
    public void setStompSession(StompSession stompSession) {
        this.stompSession = stompSession;
    }

    public void processCommand(String hubId, RemoteCommandMessage message) {
        log.info("Received command from cloud: {} for hub: {}", message, hubId);
        RemoteCommandResponse response = null;

        try {
            // Verify the user exists
            String email = message.getEmail();
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                log.error("User with email {} not found", email);
                sendErrorResponse(hubId, message, "User not found");
                return;
            }

            Long userId = user.getId();

            switch (message.getCommandType()) {
                case "GET_ALL_INTERACTIONS":
                    response = handleGetAllInteractions(userId, hubId, message);
                    break;
                case "UPDATE_STATE":
                    response = handleUpdateState(userId, hubId, message);
                    break;
                case "EXECUTE_COMMAND":
                    response = handleExecuteCommand(userId, hubId, message);
                    break;
                case "FETCH_STATE":
                    response = handleFetchState(userId, hubId, message);
                    break;
                default:
                    log.warn("Unknown command type: {}", message.getCommandType());
                    sendErrorResponse(hubId, message, "Unknown command type");
                    return;
            }

            // Send success response
            if (response != null) {
                sendResponse(hubId, response);
            }
        } catch (Exception e) {
            log.error("Error processing command: {}", e.getMessage(), e);
            sendErrorResponse(hubId, message, "Error processing command: " + e.getMessage());
        }
    }

    private RemoteCommandResponse handleGetAllInteractions(Long userId, String hubId, RemoteCommandMessage message) {
        log.info("Processing GET_ALL_INTERACTIONS command for user ID: {}", userId);
        var interactions = interactionService.getAllInteractions(userId);

        return RemoteCommandResponse.builder()
                .commandType(message.getCommandType())
                .status("SUCCESS")
                .message("Interactions retrieved successfully")
                .payload(interactions)
                .requestId(message.getRequestId())
                .build();
    }

    private RemoteCommandResponse handleUpdateState(Long userId, String hubId, RemoteCommandMessage message) {
        try {
            // Convert payload to UpdateStateRequest
            UpdateStateRequest request = objectMapper.convertValue(
                    message.getPayload(), UpdateStateRequest.class);

            log.info("Processing UPDATE_STATE command: {}", request);
            interactionService.updateStateInteraction(userId, request.getStateValueId(), request.getValue());

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("State updated successfully")
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing UPDATE_STATE command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleExecuteCommand(Long userId, String hubId, RemoteCommandMessage message) {
        try {
            // Convert payload to ExecuteCommandRequest
            ExecuteCommandRequest request = objectMapper.convertValue(
                    message.getPayload(), ExecuteCommandRequest.class);

            log.info("Processing EXECUTE_COMMAND command: {}", request);
            interactionService.commandInteraction(userId, request.getDeviceId(), request.getCommandId());

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Command executed successfully")
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing EXECUTE_COMMAND command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleFetchState(Long userId, String hubId, RemoteCommandMessage message) {
        try {
            // Get stateValueId from payload
            Long stateValueId = objectMapper.convertValue(message.getPayload(), Long.class);

            log.info("Processing FETCH_STATE command for stateValueId: {}", stateValueId);
            String currentValue = interactionService.fetchStateInteraction(userId, stateValueId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("State fetched successfully")
                    .payload(currentValue)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing FETCH_STATE command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void sendResponse(String hubId, RemoteCommandResponse response) {
        if (stompSession == null || !stompSession.isConnected()) {
            log.error("Cannot send response - no active WebSocket connection");
            return;
        }

        String destination = "/app/responses/" + hubId;
        log.info("Sending response to cloud for hub {}: {}", hubId, response);
        stompSession.send(destination, response);
    }

    private void sendErrorResponse(String hubId, RemoteCommandMessage message, String errorMessage) {
        RemoteCommandResponse response = RemoteCommandResponse.builder()
                .commandType(message.getCommandType())
                .status("ERROR")
                .message(errorMessage)
                .requestId(message.getRequestId())
                .build();
        sendResponse(hubId, response);
    }
}
