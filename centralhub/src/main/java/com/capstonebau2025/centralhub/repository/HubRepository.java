package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Hub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HubRepository extends JpaRepository<Hub, Long> {
    @Query("SELECT h FROM Hub h ORDER BY h.id ASC")
    Optional<Hub> findFirst();
}
