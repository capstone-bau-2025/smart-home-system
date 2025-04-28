package com.capstonebau2025.centralhub.service.auth;

import com.capstonebau2025.centralhub.client.CloudClient;
import com.capstonebau2025.centralhub.dto.cloudComm.LinkUserResponse;
import com.capstonebau2025.centralhub.dto.cloudComm.UserValidationResponse;
import com.capstonebau2025.centralhub.dto.localRequests.RegisterRequest;
import com.capstonebau2025.centralhub.dto.localRequests.AuthRequest;
import com.capstonebau2025.centralhub.dto.AuthResponse;
import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.exception.AuthException;
import com.capstonebau2025.centralhub.repository.AreaRepository;
import com.capstonebau2025.centralhub.repository.UserRepository;
import com.capstonebau2025.centralhub.service.HubService;
import com.capstonebau2025.centralhub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final InvitationService invitationService;
    private final UserService userService;
    private final HubService hubService;
    private final CloudClient cloudClient;
    private final AreaRepository areaRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Validate invitation and get role
        Role role = invitationService.validateInvitation(request.getInvitation());

        // make sure user is valid from cloud
        UserValidationResponse userValidationResponse = cloudClient.validateUser(
                request.getCloudToken(),
                request.getEmail());

        if(!userValidationResponse.isValid())
            throw new AuthException("Couldn't validate cloud account.");

        // link user to hub in cloud
        LinkUserResponse linkUserResponse = cloudClient.linkUser(
                request.getCloudToken(),
                request.getHubSerialNumber(),
                request.getEmail(),
                role.getName());

        if(!linkUserResponse.isSuccess())
            throw new AuthException("Couldn't link cloud account with hub.");

        // create user and save it to the hub
        User user = User.builder()
                .email(linkUserResponse.getUserData().getEmail())
                .username(linkUserResponse.getUserData().getUsername())
                .role(role)
                .build();

        user = userRepository.save(user);

        // grant permission to GENERAL area
        Area generalArea = areaRepository.findGeneralArea();
        userService.grantPermission(user.getId(), generalArea.getId());

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
                .orElseThrow(() -> new AuthException("Not authorized user."));

        UserValidationResponse userValidationResponse = cloudClient.validateUser(
                request.getCloudToken(),
                request.getEmail());

        if(!userValidationResponse.isValid())
            throw new AuthException("Couldn't validate cloud account.");

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }
}