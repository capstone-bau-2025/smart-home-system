package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Command;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommandRepository extends JpaRepository<Command, Long> {
}
