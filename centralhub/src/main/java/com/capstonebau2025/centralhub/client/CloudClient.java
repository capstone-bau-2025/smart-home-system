package com.capstonebau2025.centralhub.client;

import com.capstonebau2025.centralhub.dto.cloudComm.*;
import com.capstonebau2025.centralhub.entity.Hub;
import com.capstonebau2025.centralhub.exception.CommunicationException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class CloudClient {
    private static final Logger logger = LoggerFactory.getLogger(CloudClient.class);
    private final RestTemplate restTemplate;
    private String hubToken;

    @Value("${cloud.server.url}")
    private String cloudUrl;

    public String getHubToken(Hub hub) {
        String url = cloudUrl + "/api/hub/hub-token";
        logger.info("Requesting token from: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        GetTokenRequest requestBody = GetTokenRequest.builder()
                .serialNumber(hub.getSerialNumber())
                .key(hub.getKey())
                .build();

        HttpEntity<GetTokenRequest> request = new HttpEntity<>(requestBody, headers);

        while (true) {
            try {
                ResponseEntity<GetTokenResponse> response = restTemplate.postForEntity(
                        url, request, GetTokenResponse.class);

                String token = response.getBody().getToken();
                logger.info("Received token: {}", token != null ?
                        (token.substring(0, Math.min(10, token.length())) + "...") : "null");

                if (token == null || token.isEmpty()) {
                    throw new RuntimeException("Empty token received from server");
                }

                hubToken = token;
                return token;
            } catch (Exception e) {
                logger.error("failed to get hub token from cloud (retrying in 5 seconds): {}", e.getMessage());
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
        logger.info("Registering hub at: {}", url);

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
                logger.error("Cloud not responding, failed to register hub to cloud (retrying in 5 seconds): {}", e.getMessage());
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Thread interrupted while retrying hub registration", interruptedException);
                }
            }
        }
    }

    public UserValidationResponse validateUser(String cloudToken, String email) {
        try {
            String url = cloudUrl + "/api/hub/validateUser";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            UserValidationRequest requestBody = UserValidationRequest.builder()
                    .cloudToken(cloudToken)
                    .token(hubToken)
                    .email(email)
                    .build();
            HttpEntity<UserValidationRequest> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<UserValidationResponse> response = restTemplate.postForEntity(
                    url, request, UserValidationResponse.class);

            return response.getBody();
        } catch (Exception e) {
            logger.error("Error validating user: {}", e);
            throw new CommunicationException("Cloud server not responding, couldn't validate user.");
        }
    }

    public LinkUserResponse linkUser(String cloudToken, String hubSerialNumber, String email) {
        try {
            String url = cloudUrl + "/api/hub/linkUser";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            LinkUserRequest requestBody = LinkUserRequest.builder()
                    .cloudToken(cloudToken)
                    .hubSerialNumber(hubSerialNumber)
                    .token(hubToken)
                    .email(email)
                    .build();
            HttpEntity<LinkUserRequest> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<LinkUserResponse> response = restTemplate.postForEntity(
                    url, request, LinkUserResponse.class);

            return response.getBody();
        } catch (Exception e) {
            logger.error("Error linking user: {}", e);
            throw new CommunicationException("Cloud server not responding, couldn't link user.");
        }
    }

    public void unlinkUser(String email) {
        try {
            String url = cloudUrl + "/api/hub/unlinkUser";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            UnlinkUserRequest requestBody = new UnlinkUserRequest();
            requestBody.setToken(hubToken);
            requestBody.setEmail(email);

            HttpEntity<UnlinkUserRequest> request = new HttpEntity<>(requestBody, headers);

            restTemplate.exchange(url, HttpMethod.DELETE, request, Void.class);
            logger.info("User {} successfully unlinked from hub", email);
        } catch (Exception e) {
            logger.error("Error unlinking user: {}", e);
            throw new CommunicationException("Cloud server not responding, couldn't unlink user.");
        }
    }

    public void updateHubName(String newName) {
        try {
            String url = cloudUrl + "/api/hub/updateName";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HubUpdateNameRequest requestBody = HubUpdateNameRequest.builder()
                    .token(hubToken)
                    .name(newName)
                    .build();

            HttpEntity<HubUpdateNameRequest> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.PUT, request, String.class);

            logger.info("Hub name successfully updated to: {}", newName);
        } catch (Exception e) {
            logger.error("Error updating hub name: {}", e.getMessage());
            throw new CommunicationException("Cloud server not responding, couldn't update hub name.");
        }
    }
}
