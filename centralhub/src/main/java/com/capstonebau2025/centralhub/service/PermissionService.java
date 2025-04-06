package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.repository.AreaRepository;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import com.capstonebau2025.centralhub.repository.PermissionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final AreaRepository areaRepository;
    private final DeviceRepository deviceRepository;
    private final PermissionRepository permissionRepository;

    public List<Area> getPermittedAreas(Long userId) {
        return areaRepository.findAreasByUserId(userId);
    }

    public boolean isPermittedDevice(Long userId, Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new EntityNotFoundException("Device not found"));
        return permissionRepository.existsByUserIdAndAreaId(userId, device.getArea().getId());
    }
}
