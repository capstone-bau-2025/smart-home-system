package com.capstonebau2025.centralhub.config;

import com.capstonebau2025.centralhub.client.CloudAuthClient;
import com.capstonebau2025.centralhub.client.WebsocketClient;
import com.capstonebau2025.centralhub.dto.cloudComm.HubRegistrationResponse;
import com.capstonebau2025.centralhub.entity.Hub;
import com.capstonebau2025.centralhub.service.HubService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@RequiredArgsConstructor
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public CommandLineRunner connectToCloudServer(WebsocketClient websocketClient,
                                                  CloudAuthClient cloudAuthClient,
                                                  HubService hubService) {
        return args -> {
            Hub hub = hubService.getHub();
            if(hub.getKey() == null) {
                HubRegistrationResponse response = cloudAuthClient.registerHub(hub);
                hubService.setHubKey(response.getKey());
                hub = hubService.getHub();
            }

            cloudAuthClient.retrieveHubToken(hub.getKey(), hub.getSerialNumber());

            websocketClient.connectToCloud();
        };
    }
}
