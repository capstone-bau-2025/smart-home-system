package com.capstonebau2025.centralhub.config;

import com.capstonebau2025.centralhub.client.WebsocketClient;
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
    public CommandLineRunner connectToCloudServer(WebsocketClient websocketClient) {
        return args -> {
            websocketClient.connectToCloud();
        };
    }
}
