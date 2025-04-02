package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.dto.*;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.repository.UserRepository;
import com.capstonebau2025.centralhub.repository.InvitationRepository;
import com.capstonebau2025.centralhub.service.auth.InvitationService;
import com.capstonebau2025.centralhub.service.auth.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final InvitationService invitationService;
    private final InvitationRepository invitationRepository;
    private final JwtService jwtService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${cloud.server.url}")
    private String cloudServerUrl;

    // TODO: move this method from here to the AuthService in register method
    @Transactional
    public String addUser(AddUserRequest request) {

        // TODO: FIX request should not include invitation entity but as a string
        // 1. Validate invitation and get role
        Role role = invitationService.validateInvitation(request.getInvitation());

        // TODO: FIX UserValidationRequest is not same as cloud
        // 2. Check if user is valid from cloud
        UserValidationRequest validationRequest = UserValidationRequest.builder()
                .token(request.getCloudToken())
                .build();

        // TODO: FIX you are not reading the response from the cloud server
        restTemplate.postForObject(
                cloudServerUrl + "/api/hub/validateUser",
                validationRequest,
                Void.class
        );

        // TODO: FIX link user request is not same as cloud
        // 3. Link user with cloud and get user info
        LinkUserRequest linkRequest = LinkUserRequest.builder()
                .token(request.getCloudToken())
                .hubSerialNumber(request.getHubSerialNumber())
                .build();

        // TODO: cloud Link user does not return a user this will throw an exception, you should check if response is ok
        // but we should ask abdulrauf to make it return a user DTO with necessary information
        User cloudUser = restTemplate.postForObject(
                cloudServerUrl + "/api/hub/linkUser",
                linkRequest,
                User.class
        );

        // 4. Create user in hub db with the role
        User user = User.builder()
                .email(cloudUser.getEmail())
                .username(cloudUser.getEmail())
                .role(role)
                .build();

        user = userRepository.save(user);

        // 5. Delete the used invitation
        invitationRepository.delete(request.getInvitation());

        // 6. Return local token
        return jwtService.generateToken(user);
    }
}