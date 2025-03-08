package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.DeviceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceModelRepository extends JpaRepository<DeviceModel, Long> {
    Optional<DeviceModel> findByModel(String model);
}