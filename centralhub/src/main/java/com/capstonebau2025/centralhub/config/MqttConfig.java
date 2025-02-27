package com.capstonebau2025.centralhub.config;

import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.io.IOException;

@Configuration
@RequiredArgsConstructor
public class MqttConfig {

    private final Environment env;

    @Value("${mqtt.broker.url}")
    private String brokerUrl;

    @Value("${mqtt.client.id}")
    private String clientId;

    @Value("${mosquitto.adminUsername}")
    private String ctrlUsername;

    @Value("${mosquitto.adminPassword}")
    private String ctrlPassword;

    @Value("${mqtt.username}")
    private String mqttUsername;

    @Value("${mqtt.password}")
    private String mqttPassword;

    @Bean
    public MqttClient mqttClient() throws MqttException, IOException, InterruptedException {
        MqttClient client = new MqttClient(brokerUrl, clientId);

        createCentralHubUser(mqttUsername, mqttPassword);
        grantFullAccess(mqttUsername);

        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        options.setUserName(mqttUsername);
        options.setPassword(mqttPassword.toCharArray());

        client.connect(options);

        return client;
    }

    public void createCentralHubUser(String username, String password) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",        // Broker host
                "-u", ctrlUsername,       // Admin username
                "-P", ctrlPassword,       // Admin password
                "dynsec", "createClient", // Command
                username,                 // New client username
                "-p", password            // New client password
        );

        int process = pb.start().waitFor();

        if (process == 0) {
            System.out.println("User created successfully: " + username);
        } else {
            System.err.println("Failed to create user: " + username);
        }
    }

    public void grantFullAccess(String username) throws IOException, InterruptedException {

        // Create role for the device
        int rolePb = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ctrlUsername,
                "-P", ctrlPassword,
                "dynsec", "createRole",
                "full-access-role"
        ).start().waitFor();

        // Grant write access to all topics
        int aclWritePb = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",     // Broker host
                "-u", ctrlUsername,    // Admin username
                "-P", ctrlPassword,    // Admin password
                "dynsec", "addRoleACL",// command
                "full-access-role",    // Role name
                "publishClientSend",   // ACL type
                "#",                   // Topic pattern (# = all topics)
                "allow",                // Allow access
                "10"                    // Priority
        ).start().waitFor();

        // Grant read access to all topics
        int aclSubPb = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",     // Broker host
                "-u", ctrlUsername,    // Admin username
                "-P", ctrlPassword,    // Admin password
                "dynsec", "addRoleACL",// command
                "full-access-role",    // Role name
                "subscribeLiteral",   // ACL type
                "#",                   // Topic pattern (# = all topics)
                "allow",                // Allow access
                "10"                    // Priority
        ).start().waitFor();

        // Grant read access to all topics
        int aclReadPb = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",     // Broker host
                "-u", ctrlUsername,    // Admin username
                "-P", ctrlPassword,    // Admin password
                "dynsec", "addRoleACL",// command
                "full-access-role",    // Role name
                "publishClientReceive",// ACL type
                "#",                   // Topic pattern (# = all topics)
                "allow",                // Allow access
                "10"                    // Priority
        ).start().waitFor();

        // Grant read access to all topics with pattern
        int aclSubPatternPb = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",     // Broker host
                "-u", ctrlUsername,    // Admin username
                "-P", ctrlPassword,    // Admin password
                "dynsec", "addRoleACL",// command
                "full-access-role",    // Role name
                "subscribePattern",// ACL type
                "#",                   // Topic pattern (# = all topics)
                "allow",                // Allow access
                "10"                    // Priority
        ).start().waitFor();

        // add role to user
        int assignPb = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",         // Broker host
                "-u", ctrlUsername,        // Admin username
                "-P", ctrlPassword,        // Admin password
                "dynsec", "addClientRole", // command
                username,                  // Client username
                "full-access-role",        // Role name
                "10"          // Priority (higher = more specific)
        ).start().waitFor();

        if (rolePb == 0 && aclWritePb == 0 && aclSubPb == 0 && aclReadPb == 0 && assignPb == 0) {
            System.out.println("Full access granted to user: " + username);
        } else {
            System.err.println("Failed to grant full access to user: " + username);
        }
    }
}