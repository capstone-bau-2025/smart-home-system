package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.client.CloudClient;
import com.capstonebau2025.centralhub.dto.cloudComm.HubRegistrationResponse;
import com.capstonebau2025.centralhub.dto.localRequests.ConfigureHubRequest;
import com.capstonebau2025.centralhub.dto.GetInvitationResponse;
import com.capstonebau2025.centralhub.dto.HubInfoResponse;
import com.capstonebau2025.centralhub.entity.Hub;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.exception.ValidationException;
import com.capstonebau2025.centralhub.repository.HubRepository;
import com.capstonebau2025.centralhub.repository.RoleRepository;
import com.capstonebau2025.centralhub.repository.UserRepository;
import com.capstonebau2025.centralhub.service.auth.InvitationService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HubService {
    private final HubRepository hubRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CloudClient cloudClient;
    private final InvitationService invitationService;
    private final Logger logger = LoggerFactory.getLogger(HubService.class);

    public Hub getHub() {
        return hubRepository.findFirst()
            .orElseThrow(() -> new RuntimeException("Hub configurations missing."));
    }

    @PostConstruct
    @Transactional
    public Hub initializeHubIfNeeded() {
        logger.info("Checking if Hub configuration exists");
        if (hubRepository.count() == 0) {
            logger.info("Creating default Hub configuration");
            Hub hub = Hub.builder()
                .name("Central Hub")
                .serialNumber("123456789")
                .location("Default Location")
                .status(Hub.Status.INITIALIZING)
                .build();

            // Insert default roles
            logger.info("Inserting default roles");
            roleRepository.save(Role.builder().name("ADMIN").description("Administrator role").build());
            roleRepository.save(Role.builder().name("USER").description("Default user role").build());
            roleRepository.save(Role.builder().name("GUEST").description("Guest user role").build());

            hubRepository.save(hub);
            HubRegistrationResponse response = cloudClient.registerHub(hub);
            setHubKey(response.getKey());
            return hub;
        }
        return getHub();
    }

    public void setHubKey(String key) {
        Hub hub = getHub();
        hub.setKey(key);

        if(userRepository.count() == 0) {
            hub.setStatus(Hub.Status.SETUP);
            logger.warn("Hub is ready for setup.");
        }
        else {
            hub.setStatus(Hub.Status.RUNNING);
            logger.error("Hub was already setup but missing key. (should not happen)");
        }

        hubRepository.save(hub);
    }

    public void setHubName(String name) {
        Hub hub = getHub();
        hub.setName(name);
        cloudClient.updateHubName(name);
        hubRepository.save(hub);
    }

    public HubInfoResponse getHubInfo() {
        Hub hub = getHub();
        return HubInfoResponse.builder()
            .serialNumber(hub.getSerialNumber())
            .name(hub.getName())
            .location(hub.getLocation())
            .status(hub.getStatus().toString())
            .build();
    }

    public GetInvitationResponse configureHub(ConfigureHubRequest request) {

        if(userRepository.count() != 0)
            throw new ValidationException("hub is already configured.");

        Hub hub = getHub();
        hub.setName(request.getHubName());
        hub.setStatus(Hub.Status.RUNNING);
        hubRepository.save(hub);

        Role adminRole = roleRepository.findByName("ADMIN");

        return invitationService.generateInvitation(adminRole.getId());
    }

    public void setHubStatusRunning() {
        Hub hub = getHub();
        hub.setStatus(Hub.Status.RUNNING);
        hubRepository.save(hub);
    }
}