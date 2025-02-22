package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final RoleService roleService;
    private final PermissionService permissionService;

    @Autowired
    public UserController(UserService userService, RoleService roleService, PermissionService permissionService) {
        this.userService = userService;
        this.roleService = roleService;
        this.permissionService = permissionService;
    }

    // Create User
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

    // Get User by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Update User
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    // Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Assign Role to User
    @PostMapping("/{userId}/role/{roleId}")
    public ResponseEntity<User> assignRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
        User user = userService.assignRoleToUser(userId, roleId);
        return ResponseEntity.ok(user);
    }

    // Remove Role from User
    @DeleteMapping("/{userId}/role/{roleId}")
    public ResponseEntity<User> updateRoleFromUser(@PathVariable Long userId, @PathVariable Long roleId) {
        User user = userService.updateRoleFromUser(userId, roleId);
        return ResponseEntity.ok(user);
    }

    // Assign Permission to Role
    @PostMapping("/role/{roleId}/permission/{permissionId}")
    public ResponseEntity<Role> assignPermissionToRole(@PathVariable Long roleId, @PathVariable Long permissionId) {
        Role role = roleService.assignPermissionToRole(roleId, permissionId);
        return ResponseEntity.ok(role);
    }

    // Remove Permission from Role
    @DeleteMapping("/role/{roleId}/permission/{permissionId}")
    public ResponseEntity<Role> updatePermissionFromRole(@PathVariable Long roleId, @PathVariable Long permissionId) {
        Role role = roleService.updatePermissionFromRole(roleId, permissionId);
        return ResponseEntity.ok(role);
    }
}

