package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.DeviceDetails;
import com.capstonebau2025.centralhub.service.device.DeviceDiscoveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/device-discovery")
public class DeviceDiscoveryController {

    private final DeviceDiscoveryService discoveryService;

    // get all the devices pending for discovery
    @GetMapping
    public ResponseEntity<Map<Long, DeviceDetails>> getPendingDevices() {
        return ResponseEntity.ok(discoveryService.getDiscoveredDevices());
    }

    // approves pairing with device
    @PostMapping("/{deviceUid}")
    public ResponseEntity<DeviceDetails> pairDevice(@PathVariable Long deviceUid) {
        DeviceDetails device = discoveryService.pairDevice(deviceUid);
        if (device == null)
            return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(device);
    }
}