package com.capstonebau2025.cloudserver.repository;

import com.capstonebau2025.cloudserver.entity.Hub;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HubRepository extends JpaRepository<Hub, Long> {
    Optional<Hub> findByName(String name);
}
