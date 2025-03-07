package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.DeviceDetails;
import com.capstonebau2025.centralhub.service.mqtt.MqttMessageProducer;
import com.capstonebau2025.centralhub.service.mqtt.PendingDiscoveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/device-discovery")
public class DeviceDiscoveryController {

    private final PendingDiscoveryService pendingDiscoveryService;
    private final MqttMessageProducer mqttMessageProducer;

    // get all the devices pending for discovery
    @GetMapping
    public ResponseEntity<Map<Long, DeviceDetails>> getPendingDevices() {
        return ResponseEntity.ok(pendingDiscoveryService.getAllPendingDevices());
    }

    // approves pairing with device
    @PostMapping("/{deviceUid}")
    public ResponseEntity<String> approveDevice(@PathVariable Long deviceUid) {
        DeviceDetails device = pendingDiscoveryService.removePendingDevice(deviceUid);
        if (device == null)
            return ResponseEntity.notFound().build();

        boolean status = mqttMessageProducer.sendDeviceCredentials(device.getUid());

        // TODO: save device details to db.

        return ResponseEntity.ok("operation status:" + status);
    }
}