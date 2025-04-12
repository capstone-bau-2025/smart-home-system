package com.capstonebau2025.centralhub.service.device;

import com.capstonebau2025.centralhub.dto.DeviceDetailsDTO;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class PendingDiscoveryService {
    
    /**
     * A thread-safe map storing devices pending for discovery with their unique IDs and timestamps.
     */
    private final Map<Long, PendingDevice> pendingDevices = new ConcurrentHashMap<>();
    
    // Time-to-live in milliseconds (3 minutes)
    private static final long TTL = 3 * 60 * 1000;
    
    /**
     * Adds a device to the pending discovery list with its unique ID and details.
     *
     * @param deviceUid the unique identifier of the device
     * @param details the details of the device
     */
    public void addPendingDevice(Long deviceUid, DeviceDetailsDTO details) {
        pendingDevices.put(deviceUid, new PendingDevice(details, Instant.now()));
    }

    /**
     * Returns a map of all the devices pending discovery.
     */
    public Map<Long, DeviceDetailsDTO> getAllPendingDevices() {
        return pendingDevices.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().details));
    }

    /**
     * Removes a device from the pending discovery list by its unique ID.
     *
     * @param deviceUid the unique identifier of the device
     * @return the details of the removed device, or null if the device was not found
     */
    public DeviceDetailsDTO removePendingDevice(Long deviceUid) {
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
        final DeviceDetailsDTO details;
        final Instant timestamp;
        
        PendingDevice(DeviceDetailsDTO details, Instant timestamp) {
            this.details = details;
            this.timestamp = timestamp;
        }
    }
}