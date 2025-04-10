package com.capstonebau2025.cloudserver.service;

import com.capstonebau2025.cloudserver.dto.LinkUserRequest;
import com.capstonebau2025.cloudserver.dto.LinkUserResponse;
import com.capstonebau2025.cloudserver.dto.UserValidationResponse;
import com.capstonebau2025.cloudserver.entity.Hub;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.entity.UserHub;
import com.capstonebau2025.cloudserver.repository.HubRepository;
import com.capstonebau2025.cloudserver.repository.UserHubRepository;
import com.capstonebau2025.cloudserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LinkService {
    private final HubRepository hubRepository;
    private final UserRepository userRepository;
    private final UserHubRepository userHubRepository;
    private final UserService userService;
    private final Logger logger = LoggerFactory.getLogger(LinkService.class);

    public ResponseEntity<LinkUserResponse> linkUser(LinkUserRequest request) {
        // Validate request fields
        if (request.getCloudToken() == null || request.getCloudToken().isEmpty()) {
            return ResponseEntity.badRequest().body(LinkUserResponse.builder()
                    .success(false)
                    .message("Token is required")
                    .build());
        }
        if (request.getHubSerialNumber() == null || request.getHubSerialNumber().isEmpty()) {
            return ResponseEntity.badRequest().body(LinkUserResponse.builder()
                    .success(false)
                    .message("Hub serial number is required")
                    .build());
        }
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(LinkUserResponse.builder()
                    .success(false)
                    .message("Email is required")
                    .build());
        }

        // Validate user token
        UserValidationResponse userValidation = userService.validateUser(request.getCloudToken(), request.getEmail());
        if (!userValidation.isValid()) {
            return ResponseEntity.status(401).body(LinkUserResponse.builder()
                    .success(false)
                    .message("Invalid or expired token")
                    .build());
        }

        try {
            // Find the hub by serial number
            Hub hub = hubRepository.findBySerialNumber(request.getHubSerialNumber())
                    .orElse(null);
            if (hub == null) {
                return ResponseEntity.badRequest().body(LinkUserResponse.builder()
                        .success(false)
                        .message("Hub not found with serial number: " + request.getHubSerialNumber())
                        .build());
            }

            // Find user by email
            String email = userValidation.getUserInfo().getEmail();
            User user = userRepository.findByEmail(email)
                    .orElse(null);
            if (user == null) {
                return ResponseEntity.status(500).body(LinkUserResponse.builder()
                        .success(false)
                        .message("User not found despite valid token")
                        .build());
            }

            // Check if user is already linked to this hub - using repository query instead of collection iteration
            boolean alreadyLinked = userHubRepository.existsByUserIdAndHubId(user.getId(), hub.getId());

            if (alreadyLinked) {
                return ResponseEntity.ok(LinkUserResponse.builder()
                        .success(true)
                        .message("User is already linked to this hub")
                        .userData(LinkUserResponse.UserData.builder()
                                .userId(user.getId())
                                .email(user.getEmail())
                                .username(user.getRealUsername())
                                .build())
                        .linkTime(LocalDateTime.now())
                        .build());
            }

            // Create a new UserHub association
            UserHub userHub = UserHub.builder()
                    .user(user)
                    .hub(hub)
                    .build();

            userHubRepository.save(userHub);
            logger.info("User {} linked to hub {}", user.getEmail(), hub.getSerialNumber());

            return ResponseEntity.ok(LinkUserResponse.builder()
                    .success(true)
                    .message("User successfully linked to hub")
                    .userData(LinkUserResponse.UserData.builder()
                            .userId(user.getId())
                            .email(user.getEmail())
                            .username(user.getRealUsername())
                            .build())
                    .linkTime(LocalDateTime.now())
                    .build());
        } catch (Exception e) {
            logger.error("Error occurred while linking user to hub", e);
            return ResponseEntity.status(500).body(LinkUserResponse.builder()
                    .success(false)
                    .message("Error linking user to hub: " + e.getMessage())
                    .build());
        }
    }
}
