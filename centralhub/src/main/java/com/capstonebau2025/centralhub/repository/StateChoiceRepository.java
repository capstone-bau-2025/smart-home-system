package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.StateChoice;
import com.capstonebau2025.centralhub.entity.StateValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateChoiceRepository extends JpaRepository<StateChoice, Long> {
}
