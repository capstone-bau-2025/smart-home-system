package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.DeviceInfoDTO;
import com.capstonebau2025.centralhub.dto.IdNameDTO;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.service.device.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<List<DeviceInfoDTO>> getDevicesByArea(@PathVariable Long areaId,
                                                                @AuthenticationPrincipal User user) {
        List<DeviceInfoDTO> devices = deviceService.getDevicesByArea(areaId, user.getId());
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/filter")
    @Operation(summary = "REMOTE")
    public ResponseEntity<List<IdNameDTO>> getDevicesByFilter(
            @Parameter(description = "Filter type: 'ALL' (default), 'EVENT', 'COMMAND', 'IMMUTABLE_STATE', or 'MUTABLE_STATE'")
            @RequestParam String filter) {
        List<IdNameDTO> devices = deviceService.getDevicesByFilter(filter);
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

