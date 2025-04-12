package com.capstonebau2025.centralhub.service.auth;

import com.capstonebau2025.centralhub.client.CloudClient;
import com.capstonebau2025.centralhub.dto.cloudComm.LinkUserResponse;
import com.capstonebau2025.centralhub.dto.cloudComm.UserValidationResponse;
import com.capstonebau2025.centralhub.dto.localRequests.RegisterRequest;
import com.capstonebau2025.centralhub.dto.localRequests.AuthRequest;
import com.capstonebau2025.centralhub.dto.AuthResponse;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.repository.UserRepository;
import com.capstonebau2025.centralhub.service.HubService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final InvitationService invitationService;
    private final HubService hubService;
    private final CloudClient cloudClient;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Validate invitation and get role
        Role role = invitationService.validateInvitation(request.getInvitation());

        // make sure user is valid from cloud
        UserValidationResponse userValidationResponse = cloudClient.validateUser(
                request.getCloudToken(),
                request.getEmail());

        if(!userValidationResponse.isValid())
            throw new IllegalArgumentException("User validation failed: " + userValidationResponse.getMessage());

        // link user to hub in cloud
        LinkUserResponse linkUserResponse = cloudClient.linkUser(
                request.getCloudToken(),
                request.getHubSerialNumber(),
                request.getEmail());

        if(!linkUserResponse.isSuccess())
            throw new RuntimeException("User linking failed: " + linkUserResponse.getMessage());

        // create user and save it to the hub
        User user = User.builder()
                .email(linkUserResponse.getUserData().getEmail())
                .username(linkUserResponse.getUserData().getUsername())
                .role(role)
                .build();

        user = userRepository.save(user);

        // delete the invitation used
        invitationService.deleteInvitation(request.getInvitation());
        hubService.setHubStatusRunning();

        // generate local token and send it to the user
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserValidationResponse userValidationResponse = cloudClient.validateUser(
                request.getCloudToken(),
                request.getEmail());

        if(!userValidationResponse.isValid())
            throw new IllegalArgumentException("User validation failed: " + userValidationResponse.getMessage());

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }
}