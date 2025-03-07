package com.capstonebau2025.cloudserver.repository;

import com.capstonebau2025.cloudserver.entity.UserHub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserHubRepository extends JpaRepository<UserHub, Long> {
    // Basic CRUD operations are provided by JpaRepository
}
