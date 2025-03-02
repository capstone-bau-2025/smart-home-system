package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Permission;
import com.capstonebau2025.centralhub.entity.StateValue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StateValueRepository extends JpaRepository<StateValue, Long> {
}
