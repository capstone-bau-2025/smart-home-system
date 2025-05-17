package com.capstonebau2025.centralhub.client;

import com.capstonebau2025.centralhub.dto.*;
import com.capstonebau2025.centralhub.dto.RemoteRequests.*;
import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.exception.*;
import com.capstonebau2025.centralhub.repository.UserRepository;
import com.capstonebau2025.centralhub.service.*;
import com.capstonebau2025.centralhub.service.automation.AutomationService;
import com.capstonebau2025.centralhub.service.device.DeviceService;
import com.capstonebau2025.centralhub.service.auth.InvitationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketCommandHandler {

    private final UserDeviceInteractionService interactionService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final DeviceService deviceService;
    private final AreaService areaService;
    private final UserService userService;
    private final InvitationService invitationService;
    private final StreamingService streamingService;
    private final SurveillanceService surveillanceService;
    private final AutomationService automationService;
    @Setter
    private StompSession stompSession;

    public void processCommand(String hubSerialNumber, RemoteCommandMessage message) {
        log.info("Received command from cloud: {} for hub: {}", message, hubSerialNumber);
        RemoteCommandResponse response;

        try {
            // Verify the user exists
            String email = message.getEmail();
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                log.error("User with email {} not found", email);
                sendErrorResponse(hubSerialNumber, message, "User not found", HttpStatus.NOT_FOUND, "ResourceNotFoundException");
                return;
            }

            Long userId = user.getId();

            switch (message.getCommandType()) {
                case "GET_ALL_INTERACTIONS":
                    response = handleGetAllInteractions(userId, message);
                    break;
                case "UPDATE_STATE":
                    response = handleUpdateState(userId, message);
                    break;
                case "EXECUTE_COMMAND":
                    response = handleExecuteCommand(userId, message);
                    break;
                case "FETCH_STATE":
                    response = handleFetchState(userId, message);
                    break;
                case "SET_DEVICE_NAME":
                    response = handleSetDeviceName(message);
                    break;
                case "SET_DEVICE_AREA":
                    response = handleSetDeviceArea(message);
                    break;
                case "PING_DEVICE":
                    response = handlePingDevice(message);
                    break;
                case "GET_DEVICES_BY_AREA":
                    response = handleGetDevicesByArea(message);
                    break;
                case "DELETE_DEVICE":
                    response = handleDeleteDevice(message);
                    break;
                case "ADD_AREA":
                    response = handleAddArea(message);
                    break;
                case "GET_ALL_AREAS":
                    response = handleGetAllAreas(message);
                    break;
                case "DELETE_AREA":
                    response = handleDeleteArea(message);
                    break;
                case "GET_ALL_ROLES":
                    response = handleGetAllRoles(message);
                    break;
                case "GET_ALL_USERS":
                    response = handleGetAllUsers(message);
                    break;
                case "DELETE_USER":
                    response = handleDeleteUser(message);
                    break;
                case "UPDATE_USER_PERMISSIONS":
                    response = handleUpdateUserPermissions(message);
                    break;
                case "GET_USER_PERMISSIONS":
                    response = handleGetUserPermissions(message);
                    break;
                case "GENERATE_INVITATION":
                    response = handleGenerateInvitation(message);
                    break;
                case "INITIATE_CAMERA_STREAM":
                    handleInitiateCameraStream(message);
                    response = null;
                    break;
                case "GET_STREAMING_DEVICES":
                    response = handleGetStreamingDevices(message);
                    break;
                case "GET_ALL_AUTOMATIONS":
                    response = handleGetAllAutomations(message);
                    break;
                case "CREATE_AUTOMATION":
                    response = handleCreateAutomation(message);
                    break;
                case "TOGGLE_AUTOMATION":
                    response = handleToggleAutomation(message);
                    break;
                case "DELETE_AUTOMATION":
                    response = handleDeleteAutomation(message);
                    break;
                default:
                    log.warn("Unknown command type: {}", message.getCommandType());
                    sendErrorResponse(hubSerialNumber, message, "Unknown command type",
                            HttpStatus.BAD_REQUEST, "ValidationException");
                    return;
            }

            // Send success response
            if (response != null) {
                sendResponse(hubSerialNumber, response);
            }
        } catch (ApplicationException e) {
            log.error("ApplicationException: {}", e.getMessage(), e);
            sendErrorResponse(hubSerialNumber, message, e.getMessage(),
                    e.getStatus(), e.getClass().getSimpleName());

        } catch (Exception e) {
            log.error("Error processing command: {}", e.getMessage(), e);
            sendErrorResponse(hubSerialNumber, message, e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, "Exception");
        }
    }

    private RemoteCommandResponse handleGetAllInteractions(Long userId, RemoteCommandMessage message) {

        var interactions = interactionService.getAllInteractions(userId);

        return RemoteCommandResponse.builder()
                .commandType(message.getCommandType())
                .status("SUCCESS")
                .message("Interactions retrieved successfully")
                .payload(interactions)
                .requestId(message.getRequestId())
                .build();
    }

    private RemoteCommandResponse handleUpdateState(Long userId, RemoteCommandMessage message) {
        try {
            UpdateStateRequest request = objectMapper.convertValue(
                    message.getPayload(), UpdateStateRequest.class);

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

    private RemoteCommandResponse handleExecuteCommand(Long userId, RemoteCommandMessage message) {
        try {
            ExecuteCommandRequest request = objectMapper.convertValue(
                    message.getPayload(), ExecuteCommandRequest.class);

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

    private RemoteCommandResponse handleFetchState(Long userId, RemoteCommandMessage message) {
        try {
            Long stateValueId = objectMapper.convertValue(message.getPayload(), Long.class);

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

    // New handlers for device operations
    private RemoteCommandResponse handleSetDeviceName(RemoteCommandMessage message) {
        try {
            Map<String, Object> payload = (Map<String, Object>) message.getPayload();
            Long deviceId = Long.valueOf(payload.get("deviceId").toString());
            String name = payload.get("name").toString();

            deviceService.setDeviceName(deviceId, name);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Device name updated successfully")
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing SET_DEVICE_NAME command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleSetDeviceArea(RemoteCommandMessage message) {
        try {
            Map<String, Object> payload = (Map<String, Object>) message.getPayload();
            Long deviceId = Long.valueOf(payload.get("deviceId").toString());
            Long areaId = Long.valueOf(payload.get("areaId").toString());

            deviceService.setDeviceArea(deviceId, areaId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Device area updated successfully")
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing SET_DEVICE_AREA command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handlePingDevice(RemoteCommandMessage message) {
        try {
            Long deviceId = objectMapper.convertValue(message.getPayload(), Long.class);

            boolean isOnline = deviceService.pingDevice(deviceId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Device ping executed")
                    .payload(isOnline)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing PING_DEVICE command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleGetDevicesByArea(RemoteCommandMessage message) {
        try {
            Long areaId = objectMapper.convertValue(message.getPayload(), Long.class);

            List<DeviceInfoDTO> devices = deviceService.getDevicesByArea(areaId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Devices retrieved successfully")
                    .payload(devices)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing GET_DEVICES_BY_AREA command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleDeleteDevice(RemoteCommandMessage message) {
        try {
            Long deviceId = objectMapper.convertValue(message.getPayload(), Long.class);

            deviceService.deleteDevice(deviceId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Device deleted successfully")
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing DELETE_DEVICE command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleAddArea(RemoteCommandMessage message) {
        try {
            Map<String, Object> payload = (Map<String, Object>) message.getPayload();
            String areaName = String.valueOf(payload.get("areaName").toString());
            Integer iconId = Integer.valueOf(payload.get("iconId").toString());

            Area area = areaService.addArea(areaName, iconId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Area added successfully")
                    .payload(area)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing ADD_AREA command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleGetAllAreas(RemoteCommandMessage message) {
        try {
            List<Area> areas = areaService.getAllAreas();

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Areas retrieved successfully")
                    .payload(areas)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing GET_ALL_AREAS command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleDeleteArea(RemoteCommandMessage message) {
        try {
            Long areaId = objectMapper.convertValue(message.getPayload(), Long.class);

            areaService.deleteArea(areaId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Area deleted successfully")
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing DELETE_AREA command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleGetAllRoles(RemoteCommandMessage message) {
        try {
            List<Role> roles = userService.getAllRoles();

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Roles retrieved successfully")
                    .payload(roles)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing GET_ALL_ROLES command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleGetAllUsers(RemoteCommandMessage message) {
        try {
            List<UserDetailsDTO> users = userService.getAllUsers();

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Users retrieved successfully")
                    .payload(users)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing GET_ALL_USERS command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleDeleteUser(RemoteCommandMessage message) {
        try {
            Long userId = objectMapper.convertValue(message.getPayload(), Long.class);

            userService.deleteUser(userId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("User deleted successfully")
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing DELETE_USER command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleUpdateUserPermissions(RemoteCommandMessage message) {
        try {
            UpdateUserPermissionsRequest request = objectMapper.convertValue(
                    message.getPayload(), UpdateUserPermissionsRequest.class);

            userService.updateUserPermissions(request.getTargetUserId(), request.getRoomIds());

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("User permissions updated successfully")
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing UPDATE_USER_PERMISSIONS command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleGetUserPermissions(RemoteCommandMessage message) {
        try {
            Long userId = objectMapper.convertValue(message.getPayload(), Long.class);

            List<Long> areaIds = userService.getUserPermissions(userId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("User permissions retrieved successfully")
                    .payload(areaIds)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing GET_USER_PERMISSIONS command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleGenerateInvitation(RemoteCommandMessage message) {
        try {
            Long roleId = objectMapper.convertValue(message.getPayload(), Long.class);

            GetInvitationResponse invitation = invitationService.generateInvitation(roleId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Invitation generated successfully")
                    .payload(invitation)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing GENERATE_INVITATION command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void sendResponse(String hubSerialNumber, RemoteCommandResponse response) {
        if (stompSession == null || !stompSession.isConnected()) {
            log.error("Cannot send response - no active WebSocket connection");
            return;
        }

        String destination = "/app/responses/" + hubSerialNumber;
        stompSession.send(destination, response);
    }

    private void sendErrorResponse(String hubSerialNumber, RemoteCommandMessage message,
                                   String errorMessage, HttpStatus status, String errorType) {
        // Create a structured ErrorResponse object
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now().toString())
                .status(status.value())
                .error(errorType)
                .message(errorMessage)
                .path("/api/" + message.getCommandType().toLowerCase().replace("_", "-"))
                .build();

        RemoteCommandResponse response = RemoteCommandResponse.builder()
                .commandType(message.getCommandType())
                .status("ERROR")
                .message(errorMessage)
                .payload(errorResponse) // Include the structured error response in payload
                .requestId(message.getRequestId())
                .build();

        sendResponse(hubSerialNumber, response);
    }

    private RemoteCommandResponse handleGetStreamingDevices(RemoteCommandMessage message) {
        try {
            String email = message.getEmail();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            List<DeviceInfoDTO> devices = surveillanceService.getStreamingDevices(user.getId());

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Streaming devices retrieved successfully")
                    .payload(devices)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing GET_STREAMING_DEVICES command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void handleInitiateCameraStream(RemoteCommandMessage message) {
        try {
            // No response is needed as we'll handle the streaming separately
            CameraStreamRequest request = objectMapper.convertValue(
                    message.getPayload(), CameraStreamRequest.class);

            // Get user from email
            String email = message.getEmail();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Start a new thread to handle the streaming to avoid blocking WebSocket thread
            new Thread(() -> {
                try {
                    // Use the surveillance service to get the camera stream and send it to cloud
                    streamingService.streamCameraToCloud(
                            user.getId(),
                            request.getCameraId(),
                            request.getSessionId());
                } catch (Exception e) {
                    log.error("Error streaming camera feed to cloud: {}", e.getMessage(), e);
                }
            }).start();

        } catch (Exception e) {
            log.error("Error processing INITIATE_CAMERA_STREAM command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleGetAllAutomations(RemoteCommandMessage message) {
        try {
            List<AutomationDTO> automations = automationService.getAllAutomations();

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Automations retrieved successfully")
                    .payload(automations)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing GET_ALL_AUTOMATIONS command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleCreateAutomation(RemoteCommandMessage message) {
        try {
            String email = message.getEmail();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            CreateAutomationRequest request = objectMapper.convertValue(
                    message.getPayload(), CreateAutomationRequest.class);

            AutomationDTO automation = automationService.createAutomation(request, user);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Automation created successfully")
                    .payload(automation)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing CREATE_AUTOMATION command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleToggleAutomation(RemoteCommandMessage message) {
        try {
            ToggleAutomationRequest request = objectMapper.convertValue(
                    message.getPayload(), ToggleAutomationRequest.class);

            AutomationDTO automation = automationService.toggleAutomation(request);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Automation toggled successfully")
                    .payload(automation)
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing TOGGLE_AUTOMATION command: {}", e.getMessage(), e);
            throw e;
        }
    }

    private RemoteCommandResponse handleDeleteAutomation(RemoteCommandMessage message) {
        try {
            Long ruleId = objectMapper.convertValue(message.getPayload(), Long.class);

            automationService.deleteAutomation(ruleId);

            return RemoteCommandResponse.builder()
                    .commandType(message.getCommandType())
                    .status("SUCCESS")
                    .message("Automation deleted successfully")
                    .requestId(message.getRequestId())
                    .build();
        } catch (Exception e) {
            log.error("Error processing DELETE_AUTOMATION command: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Inner class to deserialize the camera stream request
    private static class CameraStreamRequest {
        private Long cameraId;
        private String sessionId;

        // Default constructor for Jackson
        public CameraStreamRequest() {}

        public Long getCameraId() {
            return cameraId;
        }

        public void setCameraId(Long cameraId) {
            this.cameraId = cameraId;
        }

        public String getSessionId() {
            return sessionId;
        }

        public void setSessionId(String sessionId) {
            this.sessionId = sessionId;
        }
    }
}
