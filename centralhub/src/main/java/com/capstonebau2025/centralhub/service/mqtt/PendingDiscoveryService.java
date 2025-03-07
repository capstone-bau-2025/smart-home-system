package com.capstonebau2025.centralhub.service.mqtt;

import com.capstonebau2025.centralhub.dto.DeviceDetails;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class PendingDiscoveryService {
    
    // Store device details with timestamp
    private final Map<Long, PendingDevice> pendingDevices = new ConcurrentHashMap<>();
    
    // Time-to-live in milliseconds (3 minutes)
    private static final long TTL = 3 * 60 * 1000;
    
    public void addPendingDevice(Long deviceUid, DeviceDetails details) {
        pendingDevices.put(deviceUid, new PendingDevice(details, Instant.now()));
    }
    
    public Map<Long, DeviceDetails> getAllPendingDevices() {
        return pendingDevices.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().details));
    }
    
    public DeviceDetails removePendingDevice(Long deviceUid) {
        PendingDevice device = pendingDevices.remove(deviceUid);
        return device != null ? device.details : null;
    }
    
    @Scheduled(fixedRate = 60000) // Run every minute
    public void cleanupExpiredDevices() {
        Instant expirationTime = Instant.now().minusMillis(TTL);
        pendingDevices.entrySet().removeIf(entry -> 
            entry.getValue().timestamp.isBefore(expirationTime));
    }
    
    private static class PendingDevice {
        final DeviceDetails details;
        final Instant timestamp;
        
        PendingDevice(DeviceDetails details, Instant timestamp) {
            this.details = details;
            this.timestamp = timestamp;
        }
    }
}