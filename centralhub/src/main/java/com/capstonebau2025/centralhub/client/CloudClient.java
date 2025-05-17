package com.capstonebau2025.centralhub.client;

import com.capstonebau2025.centralhub.dto.cloudComm.*;
import com.capstonebau2025.centralhub.exception.CommunicationException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import static com.capstonebau2025.centralhub.client.CloudAuthClient.hubToken;

@Component
@RequiredArgsConstructor
public class CloudClient { // TODO: add better logging of cloud error (invalid user)
    private static final Logger logger = LoggerFactory.getLogger(CloudClient.class);
    private final RestTemplate restTemplate;

    @Value("${cloud.server.url}")
    private String cloudUrl;

    public UserValidationResponse validateUser(String cloudToken, String email) {
        try {
            String url = cloudUrl + "/api/hub/validateUser";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            System.out.println(hubToken);
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

    public LinkUserResponse linkUser(String cloudToken, String hubSerialNumber, String email, String role) {
        try {
            String url = cloudUrl + "/api/hub/linkUser";
            System.out.println(hubToken);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            LinkUserRequest requestBody = LinkUserRequest.builder()
                    .cloudToken(cloudToken)
                    .hubSerialNumber(hubSerialNumber)
                    .token(hubToken)
                    .email(email)
                    .role(role)
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
            System.out.println(hubToken);
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

    public void sendNotification(String email, String title, String body) {
        try {
            String url = cloudUrl + "/api/notify";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            NotificationRequest requestBody = NotificationRequest.builder()
                    .token(hubToken)
                    .email(email)
                    .title(title)
                    .body(body)
                    .build();

            HttpEntity<NotificationRequest> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    url, request, String.class);

            logger.info("Notification sent to {} with title: {}", email, title);
        } catch (Exception e) {
            logger.error("Error sending notification: {}", e.getMessage());
            throw new CommunicationException("Cloud server not responding, couldn't send notification.");
        }
    }
}
