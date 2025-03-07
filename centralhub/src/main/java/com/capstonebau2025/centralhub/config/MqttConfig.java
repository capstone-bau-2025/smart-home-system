package com.capstonebau2025.centralhub.config;

import com.capstonebau2025.centralhub.helper.MqttUserControl;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class MqttConfig {

    @Value("${mqtt.broker.url}")
    private String brokerUrl;
    @Value("${mqtt.client.id}")
    private String clientId;

    @Value("${mqtt.username}")
    private String mqttUsername;
    @Value("${mqtt.password}")
    private String mqttPassword;

    private final Logger logger = LoggerFactory.getLogger(MqttConfig.class);
    private final MqttUserControl mqttUserControl;

    @Bean
    public MqttAsyncClient mqttAsyncClient() throws MqttException {

        MqttAsyncClient client = new MqttAsyncClient(brokerUrl, clientId);

        // Create an admin user and default user
        if(!mqttUserControl.createFullAccessUser(mqttUsername, mqttPassword))
            logger.error("Failed to create MQTT Client for application");
        if(!mqttUserControl.createDefaultUser("default-user", "password"))
            logger.error("Failed to create default MQTT User");

        // Connect to the broker
        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        options.setUserName(mqttUsername);
        options.setPassword(mqttPassword.toCharArray());

        try {
            client.connect(options).waitForCompletion();
        } catch (MqttException e) {
            logger.error("Failed to connect to MQTT broker: {}", e.getMessage());
        }

        return client;
    }
}