package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.entity.StateValue;
import com.capstonebau2025.centralhub.exception.ResourceNotFoundException;
import com.capstonebau2025.centralhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final AreaRepository areaRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;
    private final StateValueRepository stateValueRepository;

    public List<Area> getPermittedAreas(Long userId) {

        if (isUserAdmin(userId))
            return areaRepository.findAll();

        return areaRepository.findAreasByUserId(userId);
    }

    public boolean isPermittedDevice(Long userId, Long deviceId) {

        if (isUserAdmin(userId)) return true;

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + deviceId));
        return permissionRepository.existsByUserIdAndAreaId(userId, device.getArea().getId());
    }

    public boolean isPermittedStateValue(Long userId, Long stateValueId) {

        if (isUserAdmin(userId)) return true;

        StateValue stateValue = stateValueRepository.findById(stateValueId)
                .orElseThrow(() -> new ResourceNotFoundException("StateValue not found with ID: " + stateValueId));

        return permissionRepository.existsByUserIdAndAreaId(userId, stateValue.getDevice().getArea().getId());
    }

    public boolean isPermittedArea(Long userId, Long areaId) {

        if (isUserAdmin(userId)) return true;

        Area area = areaRepository.findById(areaId)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with ID: " + areaId));

        return permissionRepository.existsByUserIdAndAreaId(userId, area.getId());
    }

    public boolean isUserAdmin(Long userId) {
        return userRepository.findById(userId)
                .map(user -> "ADMIN".equals(user.getRole().getName()))
                .orElse(false);
    }
}
