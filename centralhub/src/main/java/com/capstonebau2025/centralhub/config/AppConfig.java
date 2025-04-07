package com.capstonebau2025.centralhub.config;


import com.capstonebau2025.centralhub.client.WebsocketClient;
import com.capstonebau2025.centralhub.client.CloudClient;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public CommandLineRunner connectToCloudServer() {
        return args -> {
            String hubId = "hub-001"; // Your hub's unique ID

            // Get token from cloud server (fix the port)
            CloudClient cloudClient = new CloudClient("http://localhost:8082");

            // Connect to WebSocket using the token (fix the port)
            String token = cloudClient.getToken(hubId);
            WebsocketClient hubClient = new WebsocketClient(hubId, token);
            hubClient.connectToCloud("ws://localhost:8082/hub-socket");
        };
    }
}
