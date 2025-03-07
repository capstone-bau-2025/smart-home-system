package com.capstonebau2025.centralhub.service.mqtt;

import com.capstonebau2025.centralhub.helper.MqttUserControl;
import com.capstonebau2025.centralhub.helper.PasswordGenerator;
import com.capstonebau2025.centralhub.utility.MessageIdGenerator;
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

            String response = sendMessage(deviceUid, message, configTopic);
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

    public String sendMessage(long deviceUid, ObjectNode message, String topic) {
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
                    response.wait(120000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    logger.error("Thread interrupted while waiting for message", e);
                }
            }

            // unsubscribe from response topic
            subscriber.unsubscribeToResponse(deviceUid, messageId);

            // return response if exists
            return response.get();

        } catch (MqttException e) {
            logger.error("Error sending message to device: {}", e.getMessage());
            return null;
        }
    }
    public String sendMessage(long deviceUid, ObjectNode message) {
        return sendMessage(deviceUid, message, "device/" + deviceUid + "/in");
    }
}
