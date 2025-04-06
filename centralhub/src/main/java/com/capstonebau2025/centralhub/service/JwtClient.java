package com.capstonebau2025.centralhub.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

public class JwtClient {
    private final String apiUrl;
    private final RestTemplate restTemplate;

    public JwtClient(String apiUrl) {
        this.apiUrl = apiUrl;
        this.restTemplate = new RestTemplate();
    }

    public String getToken(String hubId) {
        try {
            String url = apiUrl + "/api/auth/hub-token";
            System.out.println("Requesting token from: " + url);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("hubId", hubId);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<TokenResponse> response = restTemplate.postForEntity(
                    url, request, TokenResponse.class);

            String token = response.getBody().getToken();
            System.out.println("Received token: " + (token != null ?
                    (token.substring(0, Math.min(10, token.length())) + "...") : "null"));

            if (token == null || token.isEmpty()) {
                throw new RuntimeException("Empty token received from server");
            }

            return token;
        } catch (Exception e) {
            System.err.println("Error getting token: " + e.getMessage());
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
