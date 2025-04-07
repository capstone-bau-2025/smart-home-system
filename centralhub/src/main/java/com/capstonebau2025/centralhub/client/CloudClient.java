package com.capstonebau2025.centralhub.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

public class CloudClient {
    private static final Logger logger = LoggerFactory.getLogger(CloudClient.class);

    private final String apiUrl;
    private final RestTemplate restTemplate;

    public CloudClient(String apiUrl) {
        this.apiUrl = apiUrl;
        this.restTemplate = new RestTemplate();
    }

    public String getToken(String hubId) {
        try {
            String url = apiUrl + "/api/auth/hub-token";
            logger.info("Requesting token from: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("hubId", hubId);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<TokenResponse> response = restTemplate.postForEntity(
                    url, request, TokenResponse.class);

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

    private static class TokenResponse {
        private String token;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}
