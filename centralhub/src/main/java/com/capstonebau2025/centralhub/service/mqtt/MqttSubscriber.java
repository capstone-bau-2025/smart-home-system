package com.capstonebau2025.centralhub.service.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
public class MqttSubscriber {

    private final MqttAsyncClient mqttAsyncClient;
    private final MqttMessageHandler messageHandler;
    private final Logger logger = LoggerFactory.getLogger(MqttSubscriber.class);

    @PostConstruct
    private void subscribeToDiscovery() throws MqttException {
        if(!mqttAsyncClient.isConnected()) {
            logger.error("mqttClient not connected, could not subscribe to discovery topics");
            return;
        }

        mqttAsyncClient.subscribe("discovery/+", 0, (topic, mqttMessage) -> {
            String message = new String(mqttMessage.getPayload());
            messageHandler.handleDiscoveryRequest(message);
        });

        logger.info("Subscribed to discovery topic");
    }

    @PostConstruct
    private void subscribeToDeviceOut() throws MqttException {
        if(!mqttAsyncClient.isConnected()) {
            logger.error("mqttClient not connected, could not subscribe to devices OUT topics.");
            return;
        }

        mqttAsyncClient.subscribe("device/+/out", 0, (topic, mqttMessage) -> {
            try {
                // extract message
                String payload = new String(mqttMessage.getPayload());
                String deviceUid = topic.split("/")[1];

                // Parse JSON message
                ObjectNode message = (ObjectNode) new ObjectMapper().readTree(payload);
                String messageType = message.get("message_type").asText();

                // Route message to appropriate handler based on message_type
                switch (messageType) {
                    case "EVENT":
                        messageHandler.handleEvent(message);
                        break;
                    case "STATE_UPDATED":
                        messageHandler.handleStateUpdate(message);
                        break;
                    case "INFO":
                        messageHandler.handleInfo(message);
                        break;
                    case "PING":
                        messageHandler.handlePing(message);
                        break;
                    default:
                        logger.warn("Received unknown message type: {} from device: {}", messageType, deviceUid);
                }

                logger.info("Processed message of type {} from device with uid: {}", messageType, deviceUid);

                String response = "{\"message_type\": \"RESPONSE\", \"device_uid\": " + deviceUid + ", \"status\": \"SUCCESS\"}";
                mqttAsyncClient.publish("device/"+ deviceUid +"/in", new MqttMessage(response.getBytes()));

            } catch (JsonProcessingException e) {
                logger.error("Error parsing message from device: {}", e.getMessage());
            } catch (Exception e) {
                logger.error("Error handling device message: {}", e.getMessage());
            }
        });
        logger.info("Subscribed to devices OUT topics");
    }

    /**
     * Subscribes to a specific response topic for a given device and message ID,
     * and returns the message payload if satisfied.
     *
     * @param deviceUid the unique identifier of the device
     * @param messageId the unique identifier of the message
     * @return an AtomicReference containing the message payload
     * @throws MqttException if an error occurs during subscription
     */
    public AtomicReference<String> subscribeToResponse(long deviceUid, long messageId) throws MqttException {
        if (!mqttAsyncClient.isConnected()) return null;

        AtomicReference<String> message = new AtomicReference<>();
        // device/1111/out/1
        mqttAsyncClient.subscribe("device/" + deviceUid + "/out/" + messageId, 0, (topic, mqttMessage) -> {
            message.set(new String(mqttMessage.getPayload()));
            synchronized (message) {
                message.notify();
            }
        });
        return message;
    }

    /**
     * Unsubscribes from a specific response topic for a given device and message ID.
     * Should be called after waiting sometime to receive the response.
     *
     * @param deviceUid the unique identifier of the device
     * @param messageId the unique identifier of the message
     * @throws MqttException if an error occurs during unsubscription
     */
    public void unsubscribeToResponse(long deviceUid, long messageId) throws MqttException {
        if (mqttAsyncClient.isConnected())
            mqttAsyncClient.unsubscribe("device/" + deviceUid + "/out/"+ messageId);
    }
}