package com.capstonebau2025.centralhub.service.mqtt;

import com.capstonebau2025.centralhub.dto.DeviceDetails;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MqttMessageHandler {
    private final ObjectMapper mapper;
    private final Logger logger = LoggerFactory.getLogger(MqttMessageHandler.class);
    private final PendingDiscoveryService pendingDiscoveryService;

    public void handleDiscoveryRequest(String message) {
        try {
            DeviceDetails deviceDetails = mapper.readValue(message, DeviceDetails.class);
            pendingDiscoveryService.addPendingDevice(deviceDetails.getUid(), deviceDetails);
            logger.info("Device pending discovery with uid: {}", deviceDetails);
        } catch (JsonProcessingException e) {
            logger.error("Error parsing device details: {}", e.getMessage());
        }
    }

    public void deliverMessageToUser(String message) {}

    public void handlePingMessage(String message) {}

    public void handleEvent() {}

    public void handleStateUpdate() {}
}
