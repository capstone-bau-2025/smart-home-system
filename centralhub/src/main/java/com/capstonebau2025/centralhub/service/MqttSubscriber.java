package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.helper.MqttDynControl;
import com.capstonebau2025.centralhub.helper.PasswordGenerator;
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

            String password = PasswordGenerator.generate();
            String username = "device-" + message; //temporary username for testing
            String response;

            // create new user for device and setup access control
            if(
                MqttDynControl.createMqttUser(username, password) &&
                MqttDynControl.setupDeviceAccessControl(username)
            )
                response = "status: true , username: " + username + " , password: " + password;
            else
                response = "status: false";

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

            // sends a message back to the device for testing
            String response = "Received your message device: " + deviceId;
            mqttClient.publish("device/"+ deviceId +"/in", new MqttMessage(response.getBytes()));

            logger.info("Received message from device with id: {}", deviceId);
        });
        logger.info("Subscribed to devices OUT topics");
    }
}