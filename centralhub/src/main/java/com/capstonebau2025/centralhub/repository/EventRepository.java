package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    /**
     * Find an event by event number and device UID
     *
     * @param deviceUid the unique identifier of the device
     * @param eventNumber the event number
     * @return the Event if found
     */
    @Query("SELECT e FROM Event e " +
            "JOIN e.model m " +
            "JOIN Device d ON d.model = m " +
            "WHERE d.uid = :deviceUid AND e.number = :eventNumber")
    Optional<Event> findByDeviceUidAndEventNumber(
            @Param("deviceUid") Long deviceUid,
            @Param("eventNumber") Integer eventNumber);
}