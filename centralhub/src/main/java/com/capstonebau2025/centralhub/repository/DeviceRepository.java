package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    Optional<Device> findByUid(Long uid);
}
