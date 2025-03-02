package com.capstonebau2025.centralhub.service;

// PermissionService.java

import com.capstonebau2025.centralhub.entity.Permission;
import com.capstonebau2025.centralhub.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PermissionService extends GenericServiceImpl<Permission, Long> {

    @Autowired
    public PermissionService(PermissionRepository permissionRepository) {
        setRepository(permissionRepository);
    }

    public Permission create(Permission permission) {
        return super.create(permission);
    }

    public Permission update(Permission permission) {
        return super.update(permission);
    }

    public Optional<Permission> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<Permission> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(Permission permission) {
        super.delete(permission);
    }
}

