package com.capstonebau2025.cloudserver.service;

import com.capstonebau2025.cloudserver.entity.UserHub;
import com.capstonebau2025.cloudserver.exception.PermissionException;
import com.capstonebau2025.cloudserver.exception.ResourceNotFoundException;
import com.capstonebau2025.cloudserver.repository.UserHubRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthorizationService {

    private final UserHubRepository userHubRepository;

    /**
     * Verifies that a user has admin role for the specified hub
     *
     * @param email Email of the user
     * @param hubSerialNumber Serial number of the hub
     * @throws PermissionException if the user does not have admin role
     * @throws ResourceNotFoundException if the user-hub relationship doesn't exist
     */
    public void verifyAdminRole(String email, String hubSerialNumber) {
        UserHub userHub = userHubRepository.findByUser_EmailAndHub_SerialNumber(email, hubSerialNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No relationship found between user with email " + email +
                                " and hub with serial number " + hubSerialNumber));

        if (!"ADMIN".equals(userHub.getRole())) {
            log.warn("User {} attempted to access admin function for hub {}", email, hubSerialNumber);
            throw new PermissionException("Only admin users can perform this operation");
        }

        log.debug("User {} verified as admin for hub {}", email, hubSerialNumber);
    }
}
