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


}