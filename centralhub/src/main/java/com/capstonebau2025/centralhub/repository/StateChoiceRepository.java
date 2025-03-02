package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.StateChoice;
import com.capstonebau2025.centralhub.entity.StateValue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StateChoiceRepository extends JpaRepository<StateChoice, Long> {
}
