package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.DeviceDetailsDTO;
import com.capstonebau2025.centralhub.service.device.DeviceDiscoveryService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.security.RolesAllowed;
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
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN")
    public ResponseEntity<Map<Long, DeviceDetailsDTO>> getPendingDevices() {
        return ResponseEntity.ok(discoveryService.getDiscoveredDevices());
    }

    // approves pairing with device
    @PostMapping("/{deviceUid}")
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN")
    public ResponseEntity<DeviceDetailsDTO> pairDevice(@PathVariable Long deviceUid) {
        DeviceDetailsDTO device = discoveryService.pairDevice(deviceUid);
        if (device == null)
            return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(device);
    }
}