package com.capstonebau2025.cloudserver.service;

import com.capstonebau2025.cloudserver.dto.HubsConnected;
import com.capstonebau2025.cloudserver.dto.UserDetails;
import com.capstonebau2025.cloudserver.dto.UserValidationResponse;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public UserValidationResponse validateUser(String token, String email) {
        try {
            // Find user by provided email instead of extracting from token
            var userDetails = userRepository.findByEmail(email)
                    .orElse(null);

            if (userDetails == null) {
                return UserValidationResponse.builder()
                        .valid(false)
                        .message("User not found")
                        .build();
            }

            // Still validate the token for security
            if (!jwtService.isTokenValid(token, userDetails)) {
                return UserValidationResponse.builder()
                        .valid(false)
                        .message("Token is invalid or expired")
                        .build();
            }

            // Cast to User to access username field
            User user = (User) userDetails;

            return UserValidationResponse.builder()
                    .valid(true)
                    .message("User is valid")
                    .userInfo(UserValidationResponse.UserInfo.builder()
                            .email(user.getEmail())
                            .username(user.getRealUsername())
                            .build())
                    .build();
        } catch (Exception e) {
            return UserValidationResponse.builder()
                    .valid(false)
                    .message("Validation error")
                    .build();
        }
    }

    /**
     * Retrieves the FCM token for a user identified by their email.
     *
     * @param email The email of the user
     * @return The FCM token of the user
     * @throws IllegalStateException if the user is not found or their FCM token is null
     */
    public String getUserFcmToken(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found with email: " + email));

        String fcmToken = user.getFcmToken();
        if (fcmToken == null) {
            throw new IllegalStateException("FCM token not set for user: " + email);
        }

        return fcmToken;
    }

    public UserDetails getUserDetails(String email) {
        User user =  userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found with email: " + email));

        List<HubsConnected> hubsConnected = user.getUserHubs().stream()
                .map(userHub -> HubsConnected.builder()
                        .serialNumber(userHub.getHub().getSerialNumber())
                        .name(userHub.getHub().getName())
                        .role(userHub.getRole())
                        .build())
                .toList();

        return UserDetails.builder()
                .username(user.getRealUsername())
                .email(user.getEmail())
                .hubsConnected(hubsConnected)
                .build();
    }
}

