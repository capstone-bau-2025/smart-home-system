package com.capstonebau2025.cloudserver.service;

import com.capstonebau2025.cloudserver.entity.Hub;
import com.capstonebau2025.cloudserver.entity.UserHub;
import com.capstonebau2025.cloudserver.repository.HubRepository;
import com.capstonebau2025.cloudserver.repository.UserHubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HubService {
    private final HubRepository hubRepository;
    private final UserHubRepository userHubRepository;
    private final JwtService jwtService;

    public Hub getHubBySerialNumber(String serialNumber) {
        return hubRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException("Hub not found"));
    }

    public Hub renameHub(String serialNumber, String newName) {
        Hub hub = hubRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException("Hub not found"));
        hub.setName(newName);
        return hubRepository.save(hub);
    }

    public Hub getHubByToken(String token) {
        if(!jwtService.validateToken(token))
            throw new RuntimeException("Token is invalid or expired");

        String serialNumber = jwtService.extractUsername(token);
        return getHubBySerialNumber(serialNumber);
    }

    public boolean hubExistsBySerialNumber(String serialNumber) {
        return hubRepository.existsBySerialNumber(serialNumber);
    }

    public boolean hubExistsByToken(String token) {
        if(!jwtService.validateToken(token))
            return false;

        String serialNumber = jwtService.extractUsername(token);
        return hubExistsBySerialNumber(serialNumber);
    }

    public UserHub getUserHubLink(String serialNumber, String email) {
        return userHubRepository.findByUser_EmailAndHub_SerialNumber(email, serialNumber)
                .orElseThrow(() -> new RuntimeException("User not linked to this hub"));
    }

    public boolean isUserLinkedToHub(String serialNumber, String email) {
        return userHubRepository.existsByUser_EmailAndHub_SerialNumber(email, serialNumber);
    }
}
