package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Hub;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HubRepository extends JpaRepository<Hub, Long> {
    Optional<Hub> findBySerialNumber(Long serialNumber);}
