package com.capstonebau2025.cloudserver.repository;

import com.capstonebau2025.cloudserver.entity.UserHub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserHubRepository extends JpaRepository<UserHub, Long> {
    boolean existsByUserIdAndHubId(Long userId, Long hubId);

    // Add this method
    boolean existsByUser_EmailAndHub_SerialNumber(String email, String hubSerialNumber);
    Optional<UserHub> findByUser_EmailAndHub_SerialNumber(String email, String hubSerialNumber);
}
