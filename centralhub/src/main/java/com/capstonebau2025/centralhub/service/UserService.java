package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    // Create User
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Get User by ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // Update User
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        return userRepository.save(user);
    }

    // Delete User
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    // Assign Role to User
    public User assignRoleToUser(Long userId, Long roleId) {
        User user = getUserById(userId);
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        user.getRoles().add(role);
        return userRepository.save(user);
    }

    // Remove Role from User
    public User removeRoleFromUser(Long userId, Long roleId) {
        User user = getUserById(userId);
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        user.getRoles().remove(role);
        return userRepository.save(user);
    }
}
