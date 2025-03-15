package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends JpaRepository<State , Long> {
}
