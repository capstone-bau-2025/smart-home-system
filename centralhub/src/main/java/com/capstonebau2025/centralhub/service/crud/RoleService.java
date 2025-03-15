package com.capstonebau2025.centralhub.service.crud;

// RoleService.java

import com.capstonebau2025.centralhub.entity.Role;
import com.capstonebau2025.centralhub.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleService extends GenericServiceImpl<Role, Long> {

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        setRepository(roleRepository);
    }

    public Role create(Role role) {
        return super.create(role);
    }

    public Role update(Role role) {
        return super.update(role);
    }

    public Optional<Role> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<Role> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(Role role) {
        super.delete(role);
    }
}

