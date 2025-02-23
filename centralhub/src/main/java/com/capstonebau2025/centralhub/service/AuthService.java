package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.dto.AuthRequest;
import com.capstonebau2025.centralhub.dto.AuthResponse;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.repository.RoleRepository;
import com.capstonebau2025.centralhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(User user) {

        /*
         * TODO: Register user in hub
         * this method should register user in hub after he has been linked with hub in cloud,
         * then return local token for user to use in hub directly.
         *
         * should be used in another service that link user with hub in cloud.
         */

        userRepository.save(user);
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