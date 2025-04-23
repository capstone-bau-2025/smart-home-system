package com.capstonebau2025.centralhub.client;

import com.capstonebau2025.centralhub.dto.*;
import com.capstonebau2025.centralhub.dto.RemoteRequests.ExecuteCommandRequest;
import com.capstonebau2025.centralhub.dto.RemoteRequests.UpdateStateRequest;
import com.capstonebau2025.centralhub.dto.RemoteRequests.UpdateUserPermissionsRequest;
import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.exception.*;
import com.capstonebau2025.centralhub.repository.UserRepository;
import com.capstonebau2025.centralhub.service.device.DeviceService;
import com.capstonebau2025.centralhub.service.UserDeviceInteractionService;
import com.capstonebau2025.centralhub.service.AreaService;
import com.capstonebau2025.centralhub.service.UserService;
import com.capstonebau2025.centralhub.service.auth.InvitationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
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

    // Reference to the active WebSocket client session
    private StompSession stompSession;

    // Method to set the session from WebSocketClient
    public void setStompSession(StompSession stompSession) {
        this.stompSession = stompSession;
    }

    public void processCommand(String hubSerialNumber, RemoteCommandMessage message) {
        log.info("Received command from cloud: {} for hub: {}", message, hubSerialNumber);
        RemoteCommandResponse response = null;

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
                    response = handleGetAllInteractions(userId, hubSerialNumber, message);
                    break;
                case "UPDATE_STATE":
                    response = handleUpdateState(userId, hubSerialNumber, message);
                    break;
                case "EXECUTE_COMMAND":
                    response = handleExecuteCommand(userId, hubSerialNumber, message);
                    break;
                case "FETCH_STATE":
                    response = handleFetchState(userId, hubSerialNumber, message);
                    break;
                case "SET_DEVICE_NAME":
                    response = handleSetDeviceName(hubSerialNumber, message);
                    break;
                case "SET_DEVICE_AREA":
                    response = handleSetDeviceArea(hubSerialNumber, message);
                    break;
                case "PING_DEVICE":
                    response = handlePingDevice(hubSerialNumber, message);
                    break;
                case "GET_DEVICES_BY_AREA":
                    response = handleGetDevicesByArea(hubSerialNumber, message);
                    break;
                case "DELETE_DEVICE":
                    response = handleDeleteDevice(hubSerialNumber, message);
                    break;
                case "ADD_AREA":
                    response = handleAddArea(hubSerialNumber, message);
                    break;
                case "GET_ALL_AREAS":
                    response = handleGetAllAreas(hubSerialNumber, message);
                    break;
                case "DELETE_AREA":
                    response = handleDeleteArea(hubSerialNumber, message);
                    break;
                case "GET_ALL_ROLES":
                    response = handleGetAllRoles(hubSerialNumber, message);
                    break;
                case "GET_ALL_USERS":
                    response = handleGetAllUsers(hubSerialNumber, message);
                    break;
                case "DELETE_USER":
                    response = handleDeleteUser(hubSerialNumber, message);
                    break;
                case "UPDATE_USER_PERMISSIONS":
                    response = handleUpdateUserPermissions(hubSerialNumber, message);
                    break;
                case "GENERATE_INVITATION":
                    response = handleGenerateInvitation(hubSerialNumber, message);
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
        } catch (ResourceNotFoundException e) {
            log.error("Resource not found: {}", e.getMessage(), e);
            sendErrorResponse(hubSerialNumber, message, e.getMessage(),
                    HttpStatus.NOT_FOUND, "ResourceNotFoundException");
        } catch (ValidationException e) {
            log.error("Validation error: {}", e.getMessage(), e);
            sendErrorResponse(hubSerialNumber, message, e.getMessage(),
                    HttpStatus.BAD_REQUEST, "ValidationException");
        } catch (PermissionException e) {
            log.error("PermissionException: {}", e.getMessage(), e);
            sendErrorResponse(hubSerialNumber, message, e.getMessage(),
                    HttpStatus.FORBIDDEN, "PermissionException");
        } catch (AuthException e) {
            log.error("Authentication error: {}", e.getMessage(), e);
            sendErrorResponse(hubSerialNumber, message, e.getMessage(),
                    HttpStatus.UNAUTHORIZED, "AuthException");
        } catch (DeviceConnectionException e) {
            log.error("Device connection error: {}", e.getMessage(), e);
            sendErrorResponse(hubSerialNumber, message, e.getMessage(),
                    HttpStatus.SERVICE_UNAVAILABLE, "DeviceConnectionException");
        } catch (CommunicationException e) {
            log.error("Communication error: {}", e.getMessage(), e);
            sendErrorResponse(hubSerialNumber, message, e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, "CommunicationException");
        } catch (Exception e) {
            log.error("Error processing command: {}", e.getMessage(), e);
            sendErrorResponse(hubSerialNumber, message, e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR, "ApplicationException");
        }
    }

    private RemoteCommandResponse handleGetAllInteractions(Long userId, String hubSerialNumber, RemoteCommandMessage message) {
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

    private RemoteCommandResponse handleUpdateState(Long userId, String hubSerialNumber, RemoteCommandMessage message) {
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

    private RemoteCommandResponse handleExecuteCommand(Long userId, String hubSerialNumber, RemoteCommandMessage message) {
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

    private RemoteCommandResponse handleFetchState(Long userId, String hubSerialNumber, RemoteCommandMessage message) {
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

    // New handlers for device operations
    private RemoteCommandResponse handleSetDeviceName(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            Map<String, Object> payload = (Map<String, Object>) message.getPayload();
            Long deviceId = Long.valueOf(payload.get("deviceId").toString());
            String name = payload.get("name").toString();

            log.info("Processing SET_DEVICE_NAME command for deviceId: {}, name: {}", deviceId, name);
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

    private RemoteCommandResponse handleSetDeviceArea(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            Map<String, Object> payload = (Map<String, Object>) message.getPayload();
            Long deviceId = Long.valueOf(payload.get("deviceId").toString());
            Long areaId = Long.valueOf(payload.get("areaId").toString());

            log.info("Processing SET_DEVICE_AREA command for deviceId: {}, areaId: {}", deviceId, areaId);
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

    private RemoteCommandResponse handlePingDevice(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            Long deviceId = objectMapper.convertValue(message.getPayload(), Long.class);

            log.info("Processing PING_DEVICE command for deviceId: {}", deviceId);
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

    private RemoteCommandResponse handleGetDevicesByArea(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            Long areaId = objectMapper.convertValue(message.getPayload(), Long.class);

            log.info("Processing GET_DEVICES_BY_AREA command for areaId: {}", areaId);
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

    private RemoteCommandResponse handleDeleteDevice(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            Long deviceId = objectMapper.convertValue(message.getPayload(), Long.class);

            log.info("Processing DELETE_DEVICE command for deviceId: {}", deviceId);
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

    private RemoteCommandResponse handleAddArea(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            String areaName = objectMapper.convertValue(message.getPayload(), String.class);

            log.info("Processing ADD_AREA command for area name: {}", areaName);
            Area area = areaService.addArea(areaName);

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

    private RemoteCommandResponse handleGetAllAreas(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            log.info("Processing GET_ALL_AREAS command");
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

    private RemoteCommandResponse handleDeleteArea(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            Long areaId = objectMapper.convertValue(message.getPayload(), Long.class);

            log.info("Processing DELETE_AREA command for areaId: {}", areaId);
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

    private RemoteCommandResponse handleGetAllRoles(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            log.info("Processing GET_ALL_ROLES command");
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

    private RemoteCommandResponse handleGetAllUsers(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            log.info("Processing GET_ALL_USERS command");
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

    private RemoteCommandResponse handleDeleteUser(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            Long userId = objectMapper.convertValue(message.getPayload(), Long.class);

            log.info("Processing DELETE_USER command for userId: {}", userId);
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

    private RemoteCommandResponse handleUpdateUserPermissions(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            UpdateUserPermissionsRequest request = objectMapper.convertValue(
                    message.getPayload(), UpdateUserPermissionsRequest.class);

            log.info("Processing UPDATE_USER_PERMISSIONS command for targetUserId: {}", request.getTargetUserId());
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

    private RemoteCommandResponse handleGenerateInvitation(String hubSerialNumber, RemoteCommandMessage message) {
        try {
            Long roleId = objectMapper.convertValue(message.getPayload(), Long.class);

            log.info("Processing GENERATE_INVITATION command for roleId: {}", roleId);
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
        log.info("Sending response to cloud for hub {}: {}", hubSerialNumber, response);
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
}
