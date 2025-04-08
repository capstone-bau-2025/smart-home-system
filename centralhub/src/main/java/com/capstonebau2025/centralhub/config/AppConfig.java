package com.capstonebau2025.centralhub.config;

import com.capstonebau2025.centralhub.client.WebsocketClient;
import com.capstonebau2025.centralhub.client.CloudClient;
import com.capstonebau2025.centralhub.dto.cloudComm.HubRegistrationResponse;
import com.capstonebau2025.centralhub.entity.Hub;
import com.capstonebau2025.centralhub.service.HubService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    @Order(1)
    public CommandLineRunner registerHubToCloud(CloudClient cloudClient, HubService hubService) {
        return args -> {
            Hub hub = hubService.initializeHubIfNeeded();

            if(hub.getKey() == null) {
                HubRegistrationResponse response = cloudClient.RegisterHub(hub);
                hubService.setHubKey(response.getKey());
            }
        };
    }

    @Bean
    @Order(2)
    public CommandLineRunner connectToCloudServer(CloudClient cloudClient, HubService hubService) {
        return args -> {
            Hub hub = hubService.getHub();

            // Connect to WebSocket using the token (fix the port)
            String token = cloudClient.getToken(hub);
            WebsocketClient hubClient = new WebsocketClient(hub.getSerialNumber(), token);
            hubClient.connectToCloud("ws://localhost:8082/hub-socket");
        };
    }
}
