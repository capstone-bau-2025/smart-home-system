package com.capstonebau2025.centralhub.service.mqtt;

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

            // extract message
            String message = new String(mqttMessage.getPayload());
            String deviceUid = topic.split("/")[1];

            // TODO: Implement receiving message from device logic

            // sends a message back to the device for testing
            String response = "Received your message device: " + deviceUid;
            mqttAsyncClient.publish("device/"+ deviceUid +"/in", new MqttMessage(response.getBytes()));

            logger.info("Received message from device with uid: {}", deviceUid);
        });
        logger.info("Subscribed to devices OUT topics");
    }

    public AtomicReference<String> subscribeToResponse(long deviceUid, long messageId) throws MqttException {
        if (!mqttAsyncClient.isConnected()) return null;

        AtomicReference<String> message = new AtomicReference<>();

        mqttAsyncClient.subscribe("device/" + deviceUid + "/out/" + messageId, 0, (topic, mqttMessage) -> {
            message.set(new String(mqttMessage.getPayload()));
            synchronized (message) {
                message.notify();
            }
        });
        return message;
    }

    public void unsubscribeToResponse(long deviceUid, long messageId) throws MqttException {
        if (mqttAsyncClient.isConnected())
            mqttAsyncClient.unsubscribe("device/" + deviceUid + "/out/"+ messageId);
    }
}