package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    boolean existsByUserIdAndAreaId(Long userId, Long areaId);
    List<Permission> findByUserId(Long userId);
}
