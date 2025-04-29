package com.capstonebau2025.centralhub.service.mqtt;

import com.capstonebau2025.centralhub.dto.DeviceDetailsDTO;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.entity.Event;
import com.capstonebau2025.centralhub.entity.StateValue;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import com.capstonebau2025.centralhub.repository.EventRepository;
import com.capstonebau2025.centralhub.repository.StateValueRepository;
import com.capstonebau2025.centralhub.service.NotificationService;
import com.capstonebau2025.centralhub.service.device.PendingDiscoveryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MqttMessageHandler {
    private final ObjectMapper mapper;
    private final Logger logger = LoggerFactory.getLogger(MqttMessageHandler.class);
    private final StateValueRepository stateValueRepository;
    private final DeviceRepository deviceRepository;
    private final EventRepository eventRepository;
    private final NotificationService notificationService;
    private final PendingDiscoveryService pendingDiscoveryService;

    /**
     * Handles the discovery request message by parsing the device details
     * and adding the device to the pending discovery service.
     *
     * @param message the JSON message containing device details
     */
    public void handleDiscoveryRequest(String message) {
        try {
            DeviceDetailsDTO deviceDetailsDTO = mapper.readValue(message, DeviceDetailsDTO.class);
            pendingDiscoveryService.addPendingDevice(deviceDetailsDTO.getUid(), deviceDetailsDTO);
            logger.info("Device pending discovery with uid: {}", deviceDetailsDTO);
        } catch (JsonProcessingException e) {
            logger.error("Error parsing device details: {}", e.getMessage());
        }
    }

    public void handleStateUpdate(ObjectNode message) {
        try {
            // Extract data from message
            Long deviceUid = message.get("device_uid").asLong();
            Integer stateNumber = message.get("state_number").asInt();
            String stateValue = message.get("state_value").asText();

            // Find state value using the direct query
            Optional<StateValue> stateValueOpt = stateValueRepository.findByDeviceUidAndStateNumber(deviceUid, stateNumber);

            if (stateValueOpt.isPresent()) {
                // Update existing state value
                StateValue stateValueEntity = stateValueOpt.get();
                stateValueEntity.setStateValue(stateValue);
                stateValueRepository.save(stateValueEntity);

                // Update device last seen time
                Device device = stateValueEntity.getDevice();
                device.setLastSeen(LocalDateTime.now());
                deviceRepository.save(device);

                logger.info("Updated state {} to value {} for device {}", stateNumber, stateValue, deviceUid);
            } else {
                logger.warn("StateValue not found for device UID: {} and state number: {}", deviceUid, stateNumber);
            }
        } catch (Exception e) {
            logger.error("Error handling state update: {}", e.getMessage());
        }
    }

    @Transactional
    public void handleEvent(ObjectNode message) {
        try {
            Long deviceUid = message.get("device_uid").asLong();
            Integer stateNumber = message.get("event_number").asInt();

            Optional<Device> deviceOpt = deviceRepository.findByUid(deviceUid);
            Optional<Event> eventOpt = eventRepository.findByDeviceUidAndEventNumber(deviceUid, stateNumber);

            if (deviceOpt.isPresent() && eventOpt.isPresent()) {
                Device device = deviceOpt.get();
                Event event = eventOpt.get();

                // Update device last seen time
                device.setLastSeen(LocalDateTime.now());
                deviceRepository.save(device);

                String title = "Device " + device.getName() + " triggered " + event.getName() + " event.";
                String body = event.getDescription();
                notificationService.sendNotification(device, title, body);

                logger.info("Received event {} from device {}", stateNumber, deviceUid);
            } else {
                logger.warn("Recieved unrecognized event, device UID: {} and Event number: {}", deviceUid, stateNumber);
            }

        } catch (Exception e) {
            logger.error("Error handling event message: {}", e.getMessage());
        }
    }

    public void handlePing(ObjectNode message) {
        try {
            Long deviceUid = message.get("device_uid").asLong();
            Optional<Device> deviceOpt = deviceRepository.findByUid(deviceUid);

            if (deviceOpt.isPresent()) {
                Device device = deviceOpt.get();
                device.setLastSeen(LocalDateTime.now());
                deviceRepository.save(device);
                logger.info("Ping received from device: {}", deviceUid);
            } else {
                logger.warn("Device not found for UID: {}", deviceUid);
            }
        } catch (Exception e) {
            logger.error("Error handling ping message: {}", e.getMessage());
        }
    }

    public void handleInfo(ObjectNode message) {
        // TODO: implementation for handling info messages (optional)
    }
}
