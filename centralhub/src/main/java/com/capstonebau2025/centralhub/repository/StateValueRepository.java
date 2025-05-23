package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.StateValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StateValueRepository extends JpaRepository<StateValue, Long> {

    /**
     * Find all state values by device id
     *
     * @param deviceId the id of the device
     * @return List of StateValues
     */
    List<StateValue> findByDeviceId(Long deviceId);

    /**
     * Find a state value by device UID and state number
     *
     * @param deviceUid the unique identifier of the device
     * @param stateNumber the state number
     * @return the StateValue if found
     */
    @Query("SELECT sv FROM StateValue sv JOIN sv.device d JOIN sv.state s " +
            "WHERE d.uid = :deviceUid AND s.number = :stateNumber")
    Optional<StateValue> findByDeviceUidAndStateNumber(
            @Param("deviceUid") Long deviceUid,
            @Param("stateNumber") Integer stateNumber);

    /**
     * Find all mutable states by device id
     *
     * @param deviceId the id of the device
     * @return List of StateValues with mutable states
     */
    @Query("SELECT sv FROM StateValue sv JOIN sv.state s WHERE sv.device.id = :deviceId AND s.isMutable = true")
    List<StateValue> findMutableStatesByDeviceId(@Param("deviceId") Long deviceId);

    /**
     * Find all immutable states by device id
     *
     * @param deviceId the id of the device
     * @return List of StateValues with immutable states
     */
    @Query("SELECT sv FROM StateValue sv JOIN sv.state s WHERE sv.device.id = :deviceId AND s.isMutable = false")
    List<StateValue> findImmutableStatesByDeviceId(@Param("deviceId") Long deviceId);
}
