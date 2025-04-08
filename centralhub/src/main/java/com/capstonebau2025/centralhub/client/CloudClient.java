package com.capstonebau2025.centralhub.client;

import com.capstonebau2025.centralhub.dto.cloudComm.GetTokenRequest;
import com.capstonebau2025.centralhub.dto.cloudComm.GetTokenResponse;
import com.capstonebau2025.centralhub.dto.cloudComm.HubRegistrationRequest;
import com.capstonebau2025.centralhub.dto.cloudComm.HubRegistrationResponse;
import com.capstonebau2025.centralhub.entity.Hub;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class CloudClient {
    private static final Logger logger = LoggerFactory.getLogger(CloudClient.class);
    private final RestTemplate restTemplate;

    @Value("${cloud.server.url}")
    private String cloudUrl;

    public String getToken(Hub hub) {
        try {
            String url = cloudUrl + "/api/hub/hub-token";
            logger.info("Requesting token from: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            GetTokenRequest requestBody = GetTokenRequest.builder()
                    .serialNumber(hub.getSerialNumber())
                    .key(hub.getKey())
                    .build();

            HttpEntity<GetTokenRequest> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<GetTokenResponse> response = restTemplate.postForEntity(
                    url, request, GetTokenResponse.class);

            String token = response.getBody().getToken();
            logger.info("Received token: {}", token != null ?
                    (token.substring(0, Math.min(10, token.length())) + "...") : "null");

            if (token == null || token.isEmpty()) {
                throw new RuntimeException("Empty token received from server");
            }

            return token;
        } catch (Exception e) {
            logger.error("Error getting token: {}", e.getMessage());
            throw new RuntimeException("Failed to get authentication token", e);
        }
    }

    public HubRegistrationResponse RegisterHub(Hub hub) {
        try {
            String url = cloudUrl + "/api/hub/registerHub";
            logger.info("Registering hub at: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HubRegistrationRequest requestBody = HubRegistrationRequest.builder()
                    .serialNumber(hub.getSerialNumber())
                    .location(hub.getLocation())
                    .name(hub.getName())
                    .build();
            HttpEntity<HubRegistrationRequest> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<HubRegistrationResponse> response = restTemplate.postForEntity(
                    url, request, HubRegistrationResponse.class);

            return response.getBody();
        } catch (Exception e) {
            logger.error("Error registering hub: {}", e.getMessage());
            throw new RuntimeException("Failed to register hub", e);
        }
    }
}
