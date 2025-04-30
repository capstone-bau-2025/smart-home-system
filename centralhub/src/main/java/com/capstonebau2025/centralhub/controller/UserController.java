package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.RemoteRequests.UpdateUserPermissionsRequest;
import com.capstonebau2025.centralhub.dto.UserDetailsDTO;
import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/roles")
    @Operation(summary = "REMOTE")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = userService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    @GetMapping
    @Operation(summary = "REMOTE")
    public ResponseEntity<List<UserDetailsDTO>> getAllUsers() {
        List<UserDetailsDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{userId}")
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN, REMOTE")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update-permissions")
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN, REMOTE")
    public ResponseEntity<Void> updateUserPermissions(@RequestBody UpdateUserPermissionsRequest request) {
        userService.updateUserPermissions(request.getTargetUserId(), request.getRoomIds());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/permissions")
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN, REMOTE")
    public ResponseEntity<List<Long>> getUserPermissions(@PathVariable Long userId) {
        List<Long> areaIds = userService.getUserPermissions(userId);
        return ResponseEntity.ok(areaIds);
    }
}

