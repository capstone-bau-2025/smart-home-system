package com.capstonebau2025.centralhub.service;

import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MqttSubscriber {

    @Autowired
    private MqttClient mqttClient;
    private final Logger logger = LoggerFactory.getLogger(MqttSubscriber.class);

    @PostConstruct
    private void subscribeToDiscovery() throws MqttException {
        mqttClient.subscribe("discovery/+", (topic, mqttMessage) -> {

            // extract message
            String message = new String(mqttMessage.getPayload());

            // build config topic from discovery topic, ex. discovery/XYZ -> config/XYZ
            String configTempTopic = "config/" + topic.split("/")[1];

            // sends a response to the config topic (temporarily for testing)
            String response = "Device discovery request received with message: " + message;
            mqttClient.publish(configTempTopic, new MqttMessage(response.getBytes()));
            // TODO: Implement device discovery logic

            logger.info("Received discovery message: {} responded through: {} topic", message, configTempTopic);
        });
        logger.info("Subscribed to discovery topic");
    }

    @PostConstruct
    private void subscribeToDeviceOut() throws MqttException {
        mqttClient.subscribe("device/+/out", (topic, mqttMessage) -> {

            // extract message
            String message = new String(mqttMessage.getPayload());
            String deviceId = topic.split("/")[1];

            // TODO: Implement receiving message from device logic

            logger.info("Received message from device with id: {}", deviceId);
        });
        logger.info("Subscribed to devices OUT topics");
    }
}