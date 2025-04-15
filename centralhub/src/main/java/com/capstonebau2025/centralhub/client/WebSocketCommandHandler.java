package com.capstonebau2025.centralhub.client;

import com.capstonebau2025.centralhub.dto.RemoteCommandMessage;
import com.capstonebau2025.centralhub.dto.RemoteRequests.ExecuteCommandRequest;
import com.capstonebau2025.centralhub.dto.RemoteRequests.UpdateStateRequest;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.repository.UserRepository;
import com.capstonebau2025.centralhub.service.UserDeviceInteractionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketCommandHandler {

    private final UserDeviceInteractionService interactionService;
    private final UserRepository userRepository; // For user lookup by email
    private final ObjectMapper objectMapper;

    @MessageMapping("/commands/{hubId}")
    public void processCommand(@DestinationVariable String hubId, RemoteCommandMessage message) {
        log.info("Received command from cloud: {} for hub: {}", message, hubId);

        try {
            // Verify the user exists
            String email = message.getEmail();
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                log.error("User with email {} not found", email);
                return;
            }

            Long userId = user.getId();

            switch (message.getCommandType()) {
                case "GET_ALL_INTERACTIONS":
                    handleGetAllInteractions(userId, hubId, message);
                    break;
                case "UPDATE_STATE":
                    handleUpdateState(userId, hubId, message);
                    break;
                case "EXECUTE_COMMAND":
                    handleExecuteCommand(userId, hubId, message);
                    break;
                case "FETCH_STATE":
                    handleFetchState(userId, hubId, message);
                    break;
                default:
                    log.warn("Unknown command type: {}", message.getCommandType());
            }
        } catch (Exception e) {
            log.error("Error processing command: {}", e.getMessage(), e);
        }
    }

    private void handleGetAllInteractions(Long userId, String hubId, RemoteCommandMessage message) {
        log.info("Processing GET_ALL_INTERACTIONS command for user ID: {}", userId);
         interactionService.getAllInteractions(userId);
        // In a production implementation, you'd send the result back
    }

    private void handleUpdateState(Long userId, String hubId, RemoteCommandMessage message) {
        try {
            // Convert payload to UpdateStateRequest
            UpdateStateRequest request = objectMapper.convertValue(
                    message.getPayload(), UpdateStateRequest.class);

            log.info("Processing UPDATE_STATE command: {}", request);
            interactionService.updateStateInteraction(userId, request.getStateValueId(), request.getValue());
        } catch (Exception e) {
            log.error("Error processing UPDATE_STATE command: {}", e.getMessage(), e);
        }
    }

    private void handleExecuteCommand(Long userId, String hubId, RemoteCommandMessage message) {
        try {
            // Convert payload to ExecuteCommandRequest
            ExecuteCommandRequest request = objectMapper.convertValue(
                    message.getPayload(), ExecuteCommandRequest.class);

            log.info("Processing EXECUTE_COMMAND command: {}", request);
            interactionService.commandInteraction(userId, request.getDeviceId(), request.getCommandId());
        } catch (Exception e) {
            log.error("Error processing EXECUTE_COMMAND command: {}", e.getMessage(), e);
        }
    }

    private void handleFetchState(Long userId, String hubId, RemoteCommandMessage message) {
        try {
            // Get stateValueId from payload
            Long stateValueId = objectMapper.convertValue(message.getPayload(), Long.class);

            log.info("Processing FETCH_STATE command for stateValueId: {}", stateValueId);
            String currentValue = interactionService.fetchStateInteraction(userId, stateValueId);
            // In a complete implementation, you'd send this back to the cloud
        } catch (Exception e) {
            log.error("Error processing FETCH_STATE command: {}", e.getMessage(), e);
        }
    }

    @SubscribeMapping("/topic/commands/{hubId}")
    public void onSubscribe(@DestinationVariable String hubId) {
        log.info("Hub {} subscribed to commands topic", hubId);
    }
}
