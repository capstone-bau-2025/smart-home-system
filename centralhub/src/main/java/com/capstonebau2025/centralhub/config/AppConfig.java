package com.capstonebau2025.centralhub.config;

import com.capstonebau2025.centralhub.client.WebsocketClient;
import com.capstonebau2025.centralhub.client.CloudClient;
import com.capstonebau2025.centralhub.dto.cloudComm.HubRegistrationResponse;
import com.capstonebau2025.centralhub.entity.Hub;
import com.capstonebau2025.centralhub.service.HubService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.client.RestTemplate;

@Configuration
@RequiredArgsConstructor
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
                HubRegistrationResponse response = cloudClient.registerHub(hub);
                hubService.setHubKey(response.getKey());
            }
        };
    }

    @Bean
    @Order(2)
    public CommandLineRunner connectToCloudServer(WebsocketClient websocketClient) {
        return args -> {
            websocketClient.connectToCloud();
        };
    }
}
