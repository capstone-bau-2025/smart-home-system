package com.capstonebau2025.centralhub.service;

// UserService.java

import com.capstonebau2025.centralhub.dto.*;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.repository.InvitationRepository;
import com.capstonebau2025.centralhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.util.Optional;

@Service
public class UserService extends GenericServiceImpl<User, Long> {

    private final UserRepository userRepository;
    private final InvitationService invitationService;
    private final InvitationRepository invitationRepository;
    private final JwtService jwtService;
    private final RestTemplate restTemplate;

    @Value("${cloud.server.url}")
    private String cloudServerUrl;

    @Autowired
    public UserService(UserRepository userRepository,
                       InvitationService invitationService,
                       InvitationRepository invitationRepository,
                       JwtService jwtService) {
        setRepository(userRepository);
        this.userRepository = userRepository;
        this.invitationService = invitationService;
        this.invitationRepository = invitationRepository;
        this.jwtService = jwtService;
        this.restTemplate = new RestTemplate();
    }

    public User create(User user) {
        return super.create(user);
    }

    public User update(User user) {
        return super.update(user);
    }

    public Optional<User> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<User> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(User user) {
        super.delete(user);
    }

    @Transactional
    public String addUser(AddUserRequest request) {
        // 1. Validate invitation and get role
        Role role = invitationService.validateInvitation(request.getInvitation());

        // 2. Check if user is valid from cloud
        UserValidationRequest validationRequest = UserValidationRequest.builder()
                .token(request.getCloudToken())
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
                .role(role)
                .build();

        user = create(user);

        //5. delete invitation
        invitationRepository.delete(request.getInvitation());

        // 6. Return local token
        return jwtService.generateToken(user);

    }
}