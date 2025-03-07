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

    public UserValidationResponse validateUser(String token) {
        try {
            String username = jwtService.extractUsername(token);
            if (username == null) {
                return UserValidationResponse.builder()
                        .valid(false)
                        .message("Invalid token")
                        .build();
            }

            UserDetails userDetails = userRepository.findByEmail(username)
                    .orElse(null);

            if (userDetails == null) {
                return UserValidationResponse.builder()
                        .valid(false)
                        .message("User not found")
                        .build();
            }

            if (!jwtService.isTokenValid(token, userDetails)) {
                return UserValidationResponse.builder()
                        .valid(false)
                        .message("Token is invalid or expired")
                        .build();
            }

            return UserValidationResponse.builder()
                    .valid(true)
                    .message("User is valid")
                    .userInfo(UserValidationResponse.UserInfo.builder()
                            .email(userDetails.getUsername())
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






















//package com.capstonebau2025.cloudserver.service;
//
//import com.capstonebau2025.cloudserver.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class UserService {
//    private final JwtService jwtService;
//    private final UserRepository userRepository;
//
//    public boolean validateUser(String token) {
//        try {
//            String username = jwtService.extractUsername(token);
//            if (username == null) {
//                return false;
//            }
//
//            UserDetails userDetails = userRepository.findByEmail(username)
//                    .orElse(null);
//
//            if (userDetails == null) {
//                return false;
//            }
//
//            return jwtService.isTokenValid(token, userDetails);
//        } catch (Exception e) {
//            return false;
//        }
//    }
//}
