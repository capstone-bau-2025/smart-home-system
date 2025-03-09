package com.capstonebau2025.cloudserver.service;

import com.capstonebau2025.cloudserver.dto.UserValidationResponse;
import com.capstonebau2025.cloudserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

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
            var user = (com.capstonebau2025.cloudserver.entity.User) userDetails;

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
}

