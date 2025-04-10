package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final RoleRepository roleRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}