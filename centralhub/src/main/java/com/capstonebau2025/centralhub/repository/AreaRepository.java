package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
}
