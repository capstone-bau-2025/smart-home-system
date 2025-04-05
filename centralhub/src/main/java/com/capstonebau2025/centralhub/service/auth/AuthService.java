package com.capstonebau2025.centralhub.service.auth;

import com.capstonebau2025.centralhub.dto.*;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.repository.InvitationRepository;
import com.capstonebau2025.centralhub.repository.UserRepository;
import com.capstonebau2025.centralhub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final InvitationService invitationService;
    private final InvitationRepository invitationRepository;
    private final RestTemplate restTemplate;
    private final UserService userService;

    @Value("${cloud.server.url}")
    private String cloudServerUrl;


    public AuthResponse register(AddUserRequest request) {
            // 1. Validate invitation and get role
            Role role = invitationService.validateInvitation(request.getInvitation());

            // 2. Check if user is valid from cloud
            UserValidationRequest validationRequest = UserValidationRequest.builder()
                    .token(request.getCloudToken())
                    .email(request.getEmail())
                    .build();

            restTemplate.postForObject(
                    cloudServerUrl + "/api/hub/validateUser",
                    validationRequest,
                    Void.class
            );

            // 3. Link user with cloud and get user info
            LinkUserRequest linkRequest = LinkUserRequest.builder()
                    .token(request.getCloudToken())
                    .hubSerialNumber(request.getHubSerialNumber())
                    .email(request.getEmail())
                    .build();

            User cloudUser = restTemplate.postForObject(
                    cloudServerUrl + "/api/hub/linkUser",
                    linkRequest,
                    User.class
            );

            // 4. Create user in hub db with the role
            User user = User.builder()
                    .email(cloudUser.getEmail())
                    .username(cloudUser.getEmail())
                    .role(cloudUser.getRole())
                    .build();

            user = userRepository.save(user);

            // 5. Delete the used invitation
            // invitationRepository.delete(invitationRepository.findByCode(request.getInvitation()));
            invitationRepository.findByCode(request.getInvitation())
                    .ifPresent(invitation -> invitationRepository.delete(invitation));

            // 6. Return auth response with token
            var jwtToken = jwtService.generateToken(user);
            return AuthResponse.builder()
                    .token(jwtToken)
                    .build();
        }


    public AuthResponse authenticate(AuthRequest request) {

        // MOCK to resolve compilation error, normally should be fetched from cloud by cloud token.
        var mockUser = new User();

        /*
        * TODO: Implement user authentication (give local token) with cloud token
        * this method should generate local token for user based on cloud token,
        * but user must be already registered in hub and cloud, and linked with this hub in cloud,
        * this method is used if user is logging in again in app or his local token has expired.
        */

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        mockUser.getEmail(),
                        mockUser.getPassword()
                )
        );
        var user = userRepository.findByEmail(mockUser.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }
}