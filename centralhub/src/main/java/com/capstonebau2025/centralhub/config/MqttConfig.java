package com.capstonebau2025.centralhub.config;

import com.capstonebau2025.centralhub.helper.MqttDynControl;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

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

    @Bean
    public MqttClient mqttClient(MqttDynControl mqttDynControl) throws MqttException, IOException, InterruptedException {
        MqttClient client = new MqttClient(brokerUrl, clientId);

        // Create an admin user with full access for the central hub to use
        MqttDynControl.createMqttUser(mqttUsername, mqttPassword);
        MqttDynControl.grantFullAccess(mqttUsername);

        // Create a default user with limited access for discovering devices
        MqttDynControl.createMqttUser("default-user", "password");
        MqttDynControl.createRole("default-user-role");
        MqttDynControl.grantWriteAccess("default-user-role", "discovery/+");
        MqttDynControl.grantPatternReadAccess("default-user-role", "config/+");
        mqttDynControl.denyReadAccess("default-user-role", "config/+");
        MqttDynControl.addRoleToUser("default-user-role", "default-user");

        // Connect to the broker
        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        options.setUserName(mqttUsername);
        options.setPassword(mqttPassword.toCharArray());

        client.connect(options);

        return client;
    }
}