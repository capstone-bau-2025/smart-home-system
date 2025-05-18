package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.DeviceInfoDTO;
import com.capstonebau2025.centralhub.service.device.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @PutMapping("/{id}/name")
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN, REMOTE")
    public ResponseEntity<Void> setDeviceName(@PathVariable Long id, @RequestParam String name) {
        deviceService.setDeviceName(id, name);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/area")
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN, REMOTE")
    public ResponseEntity<Void> setDeviceArea(@PathVariable Long id, @RequestParam Long areaId) {
        deviceService.setDeviceArea(id, areaId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/ping")
    @Operation(summary = "REMOTE")
    public ResponseEntity<Boolean> pingDevice(@PathVariable Long id) {
        boolean isOnline = deviceService.pingDevice(id);
        return ResponseEntity.ok(isOnline);
    }

    @GetMapping("/by-area/{areaId}")
    @Operation(summary = "REMOTE")
    public ResponseEntity<List<DeviceInfoDTO>> getDevicesByArea(@PathVariable Long areaId) {
        List<DeviceInfoDTO> devices = deviceService.getDevicesByArea(areaId);
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/filter")
    @Operation(summary = "REMOTE")
    public ResponseEntity<List<DeviceInfoDTO>> getDevicesByFilter(@RequestParam String filter) {
        List<DeviceInfoDTO> devices = deviceService.getDevicesByFilter(filter);
        return ResponseEntity.ok(devices);
    }

    @DeleteMapping("/{id}")
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN, REMOTE")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }
}

