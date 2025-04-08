package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.Hub;
import com.capstonebau2025.centralhub.repository.HubRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HubService {
    private final HubRepository hubRepository;
    private final Logger logger = LoggerFactory.getLogger(HubService.class);

    public Hub getHub() {
        return hubRepository.findFirst()
            .orElseThrow(() -> new RuntimeException("Hub configurations missing."));
    }

    @Transactional
    public Hub initializeHubIfNeeded() {
        if (hubRepository.count() == 0) {
            logger.info("Creating default Hub configuration");
            Hub hub = Hub.builder()
                .name("Central Hub")
                .serialNumber("123456789")
                .location("Default Location")
                .status(Hub.Status.SETUP)
                .build();
            return hubRepository.save(hub);
        }
        return getHub();
    }

    public Hub setHubKey(String key) {
        Hub hub = getHub();
        hub.setKey(key);
        hub.setStatus(Hub.Status.RUNNING);
        return hubRepository.save(hub);
    }
}