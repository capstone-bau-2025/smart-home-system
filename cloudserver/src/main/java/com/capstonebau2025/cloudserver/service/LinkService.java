package com.capstonebau2025.cloudserver.service;

import com.capstonebau2025.cloudserver.dto.LinkUserRequest;
import com.capstonebau2025.cloudserver.dto.UserValidationResponse;
import com.capstonebau2025.cloudserver.entity.Hub;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.entity.UserHub;
import com.capstonebau2025.cloudserver.repository.HubRepository;
import com.capstonebau2025.cloudserver.repository.UserHubRepository;
import com.capstonebau2025.cloudserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LinkService {
    private final HubRepository hubRepository;
    private final UserRepository userRepository;
    private final UserHubRepository userHubRepository;
    private final UserService userService;

    public ResponseEntity<?> linkUser(LinkUserRequest request) {
        // Validate request fields
        if (request.getToken() == null || request.getToken().isEmpty()) {
            return ResponseEntity.badRequest().body("Token is required");
        }
        if (request.getHubSerialNumber() == null || request.getHubSerialNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Hub serial number is required");
        }
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        // Validate user token
        UserValidationResponse userValidation = userService.validateUser(request.getToken(), request.getEmail());
        if (!userValidation.isValid()) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }

        try {
            // Find the hub by serial number
            Hub hub = hubRepository.findBySerialNumber(Long.valueOf(request.getHubSerialNumber()))
                    .orElse(null);
            if (hub == null) {
                return ResponseEntity.badRequest().body("Hub not found with serial number: " + request.getHubSerialNumber());
            }

            // Find user by email
            String email = userValidation.getUserInfo().getEmail();
            User user = userRepository.findByEmail(email)
                    .orElse(null);
            if (user == null) {
                return ResponseEntity.status(500).body("User not found despite valid token");
            }

            // Check if user is already linked to this hub
            boolean alreadyLinked = hub.getUserHubs().stream()
                    .anyMatch(userHub -> userHub.getUser().getId().equals(user.getId()));

            if (alreadyLinked) {
                return ResponseEntity.ok("User is already linked to this hub");
            }

            // Create a new UserHub association
            UserHub userHub = UserHub.builder()
                    .user(user)
                    .hub(hub)
                    .build();

            userHubRepository.save(userHub);

            return ResponseEntity.ok("User successfully linked to hub");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid hub serial number format");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error linking user to hub: " + e.getMessage());
        }
    }
}
