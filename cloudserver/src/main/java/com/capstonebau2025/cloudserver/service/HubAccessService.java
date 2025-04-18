package com.capstonebau2025.cloudserver.service;

import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.exception.UnauthorizedException;
import com.capstonebau2025.cloudserver.repository.UserHubRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class HubAccessService {

    private final UserHubRepository userHubRepository;

    /**
     * Validates that the current user has access to the specified hub
     *
     * @param hubSerialNumber The hub serial number
     * @return The authenticated user if access is granted
     * @throws UnauthorizedException if user doesn't have access to the hub
     */
    public User validateUserHubAccess(String hubSerialNumber) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        String email = user.getEmail();

        boolean hasAccess = userHubRepository.existsByUser_EmailAndHub_SerialNumber(email, hubSerialNumber);

        if (!hasAccess) {
            log.warn("Access denied for user {} to hub {}", email, hubSerialNumber);
            throw new UnauthorizedException("You don't have access to this hub");
        }

        log.debug("Access granted for user {} to hub {}", email, hubSerialNumber);
        return user;
    }
}
