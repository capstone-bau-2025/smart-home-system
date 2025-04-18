package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.dto.UserDetailsDTO;
import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.entity.Permission;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.repository.AreaRepository;
import com.capstonebau2025.centralhub.repository.PermissionRepository;
import com.capstonebau2025.centralhub.repository.RoleRepository;
import com.capstonebau2025.centralhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final AreaRepository areaRepository;
    private final PermissionRepository permissionRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public List<UserDetailsDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserDetailsDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole().getName())
                        .build())
                .collect(Collectors.toList());
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public void updateUserPermissions(Long userId, List<Long> roomIds) {
        // Find the user by ID
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if(user.getRole().getName() == "ADMIN") {
            throw new RuntimeException("Cannot change permissions for ADMIN user");
        }

        // Get all areas (rooms) by their IDs
        List<Area> areas = areaRepository.findAllById(roomIds);

        // Get current permissions for the user
        List<Permission> currentPermissions = permissionRepository.findByUserId(userId);

        // Remove permissions for rooms not in the provided list
        List<Permission> permissionsToRemove = currentPermissions.stream()
            .filter(permission -> !roomIds.contains(permission.getArea().getId()))
            .collect(Collectors.toList());
        permissionRepository.deleteAll(permissionsToRemove);

        // Add permissions for new rooms
        Set<Long> currentAreaIds = currentPermissions.stream()
            .map(permission -> permission.getArea().getId())
            .collect(Collectors.toSet());

        List<Permission> newPermissions = areas.stream()
            .filter(area -> !currentAreaIds.contains(area.getId()))
            .map(area -> Permission.builder()
                .user(user)
                .area(area)
                .build())
            .collect(Collectors.toList());

        permissionRepository.saveAll(newPermissions);
    }

    public List<Long> getUserPermissions(Long userId) {
        if (!userRepository.existsById(userId))
            throw new RuntimeException("User not found");

        return permissionRepository.findByUserId(userId).stream()
            .map(permission -> permission.getArea().getId())
            .collect(Collectors.toList());
    }

    public void grantPermission(Long userId, Long areaId) {
        // Find the user by ID
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the user already has permission for the area
        boolean hasPermission = permissionRepository.existsByUserIdAndAreaId(userId, areaId);
        if (hasPermission) {
            throw new RuntimeException("User already has permission for this area");
        }

        // Find the area by ID
        Area area = areaRepository.findById(areaId)
            .orElseThrow(() -> new RuntimeException("Area not found"));

        // Create and save the new permission
        Permission permission = Permission.builder()
            .user(user)
            .area(area)
            .build();
        permissionRepository.save(permission);
    }
}