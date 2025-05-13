package com.capstonebau2025.centralhub.client;

import com.capstonebau2025.centralhub.dto.cloudComm.GetTokenRequest;
import com.capstonebau2025.centralhub.dto.cloudComm.GetTokenResponse;
import com.capstonebau2025.centralhub.dto.cloudComm.HubRegistrationRequest;
import com.capstonebau2025.centralhub.dto.cloudComm.HubRegistrationResponse;
import com.capstonebau2025.centralhub.entity.Hub;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class CloudAuthClient {
    private final RestTemplate restTemplate;

    public static String hubToken;

    @Value("${cloud.server.url}")
    private String cloudUrl;

    public String retrieveHubToken(String key, String serialNumber) {
        String url = cloudUrl + "/api/hub/hub-token";
        log.info("Requesting token from: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        GetTokenRequest requestBody = GetTokenRequest.builder()
                .serialNumber(serialNumber)
                .key(key)
                .build();

        HttpEntity<GetTokenRequest> request = new HttpEntity<>(requestBody, headers);

        while (true) {
            try {
                ResponseEntity<GetTokenResponse> response = restTemplate.postForEntity(
                        url, request, GetTokenResponse.class);

                String token = response.getBody().getToken();
                log.info("Received token: {}", token != null ?
                        (token.substring(0, Math.min(10, token.length())) + "...") : "null");

                if (token == null || token.isEmpty()) {
                    throw new RuntimeException("Empty token received from server");
                }

                hubToken = token;
                return token;
            } catch (Exception e) {
                log.error("failed to get hub token from cloud (retrying in 5 seconds): {}", e.getMessage());
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Thread interrupted while retrying to get token", interruptedException);
                }
            }
        }
    }

    public HubRegistrationResponse registerHub(Hub hub) {
        String url = cloudUrl + "/api/hub/registerHub";
        log.info("Registering hub at: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HubRegistrationRequest requestBody = HubRegistrationRequest.builder()
                .serialNumber(hub.getSerialNumber())
                .location(hub.getLocation())
                .name(hub.getName())
                .build();
        HttpEntity<HubRegistrationRequest> request = new HttpEntity<>(requestBody, headers);

        while (true) {
            try {
                ResponseEntity<HubRegistrationResponse> response = restTemplate.postForEntity(
                        url, request, HubRegistrationResponse.class);
                return response.getBody();
            } catch (Exception e) {
                log.error("Cloud not responding, failed to register hub to cloud (retrying in 5 seconds): {}", e.getMessage());
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Thread interrupted while retrying hub registration", interruptedException);
                }
            }
        }
    }
}
