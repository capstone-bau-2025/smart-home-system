package com.capstonebau2025.centralhub.service.mqtt;

import com.capstonebau2025.centralhub.helper.MqttUserControl;
import com.capstonebau2025.centralhub.helper.PasswordGenerator;
import com.capstonebau2025.centralhub.utility.MessageIdGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
public class MqttMessageProducer {
    private final ObjectMapper mapper;
    private final MqttAsyncClient mqttAsyncClient;
    private final MqttSubscriber subscriber;
    private final MqttUserControl dynControl;
    private final Logger logger = LoggerFactory.getLogger(MqttMessageProducer.class);

    /**
     * create mqtt user and sends device credentials to the specified device via MQTT.
     *
     * @param deviceUid the unique identifier of the device
     * @return true if the credentials were successfully sent, false otherwise
     */
    public boolean sendDeviceCredentials(long deviceUid) {

        String configTopic = "config/" + deviceUid;
        String password = PasswordGenerator.generate();
        String username = "device-" + deviceUid;

        if (dynControl.createDeviceUser(username, password, deviceUid)) {

            ObjectNode message = mapper.createObjectNode()
                    .put("message_type", "CONFIG")
                    .put("username", username)
                    .put("password", password)
                    .put("uid", deviceUid);

            ObjectNode response = sendMessage(deviceUid, message, configTopic);
            if(response != null) {
                logger.info("successfully paired with device uid: {}", deviceUid);
                return true;
            }
            else {
                logger.warn("couldn't pair, device not responding: {}", deviceUid);
                // TODO: remove user from mqtt again
                return false;
            }
        }
        logger.error("Failed to create device user: {}", deviceUid);
        return false;
    }

    /**
     * Retrieves the current value of a specified state for a given device.
     *
     * @param deviceUid the unique identifier of the device
     * @param stateNumber the number of the state to retrieve
     * @return the current value of the state, or null if an error occurred
     */
    public String getStateValue(long deviceUid, int stateNumber) {
        ObjectNode message = mapper.createObjectNode()
                .put("message_type", "GET_STATE")
                .put("device_uid", deviceUid)
                .put("state_number", stateNumber);

        ObjectNode response = sendMessage(deviceUid, message);
        if(response == null) return null;

        return response.get("value").asText();
    }

    /**
     * Sets the value of a specified state for a given device.
     *
     * @param deviceUid the unique identifier of the device
     * @param stateNumber the number of the state to set
     * @param value the value to set for the state
     * @return true if the state value was successfully set, false otherwise
     */
    public boolean setStateValue(long deviceUid, int stateNumber, String value) {
        ObjectNode message = mapper.createObjectNode()
                .put("message_type", "SET_STATE")
                .put("device_uid", deviceUid)
                .put("state_number", stateNumber)
                .put("value", value);

        ObjectNode response = sendMessage(deviceUid, message);
        return response != null;
    }

    /**
     * Sends a command to a specified device.
     *
     * @param deviceUid the unique identifier of the device
     * @param commandNumber the number of the command to send
     * @return true if the command was successfully sent, false otherwise
     */
    public boolean sendCommand(long deviceUid, int commandNumber) {
        ObjectNode message = mapper.createObjectNode()
                .put("message_type", "COMMAND")
                .put("device_uid", deviceUid)
                .put("command_number", commandNumber);

        ObjectNode response = sendMessage(deviceUid, message);
        return response != null;
    }

    /**
     * Pings a specified device to check if it is online.
     *
     * @param deviceUid the unique identifier of the device
     * @return true if the device is online, false otherwise
     */
    public boolean pingDevice(long deviceUid) {
        ObjectNode message = mapper.createObjectNode()
                .put("message_type", "PING")
                .put("device_uid", deviceUid);

        ObjectNode response = sendMessage(deviceUid, message);
        return response != null;
    }

    /**
     * Sends a message to a specified topic for a given device UID and waits for a response.
     *
     * @param deviceUid the unique identifier of the device
     * @param message the message to be sent
     * @param topic the topic to which the message will be published
     * @return the response from the device, or null if an error occurred
     */
    public ObjectNode sendMessage(long deviceUid, ObjectNode message, String topic) {
        try {
            //prepare message
            int messageId = MessageIdGenerator.generateMessageId();
            message.put("message_id", messageId);

            // subscribe to response with same message_id
            AtomicReference<String> response = subscriber.subscribeToResponse(deviceUid, messageId);

            // Send the message
            mqttAsyncClient.publish(topic, new MqttMessage(message.toString().getBytes()));

            // wait for response
            synchronized (response) {
                try {
                    logger.info("Waiting for response from device: {}", deviceUid);
                    response.wait(5000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    logger.error("Thread interrupted while waiting for message", e);
                    return null;
                }
            }

            // unsubscribe from response topic
            subscriber.unsubscribeToResponse(deviceUid, messageId);

            if(response.get() == null) {
                logger.warn("No response from device: {}", deviceUid);
                return null;
            }

            try {
                // Process the jsonResponse as needed
                ObjectNode jsonResponse = (ObjectNode) mapper.readTree(response.get());
                if(jsonResponse.get("status") != null && jsonResponse.get("status").asText().equals("SUCCESS"))
                    return jsonResponse;
                logger.error("device response status not success: {}", jsonResponse);
            } catch (JsonProcessingException e) {
                logger.error("Error parsing JSON response: {}", e.getMessage());
            }
            return null;

        } catch (MqttException e) {
            logger.error("Error sending message to device: {}", e.getMessage());
            return null;
        }
    }
    public ObjectNode sendMessage(long deviceUid, ObjectNode message) {
        return sendMessage(deviceUid, message, "device/" + deviceUid + "/in");
    }
}
