package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.StateValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StateValueRepository extends JpaRepository<StateValue, Long> {
    List<StateValue> findByDeviceId(Long deviceId);
}
