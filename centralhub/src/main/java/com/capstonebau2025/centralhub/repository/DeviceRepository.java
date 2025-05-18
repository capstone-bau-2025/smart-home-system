package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {

    Optional<Device> findByUid(Long uid);
    List<Device> findByAreaId(Long areaId);
    List<Device> findByModelSupportStreamingTrue();

    // Find devices that have events
    @Query("SELECT d FROM Device d WHERE SIZE(d.model.events) > 0")
    List<Device> findByModelEventsIsNotEmpty();

    // Find devices that have commands
    @Query("SELECT d FROM Device d WHERE SIZE(d.model.commands) > 0")
    List<Device> findByModelCommandsIsNotEmpty();

    // Find devices that have mutable states
    @Query("SELECT d FROM Device d JOIN d.model.states s WHERE s.isMutable = true")
    List<Device> findByModelMutableStatesIsNotEmpty();

    // Find devices that have immutable states
    @Query("SELECT d FROM Device d JOIN d.model.states s WHERE s.isMutable = false")
    List<Device> findByModelImmutableStatesIsNotEmpty();
}
