package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Command;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommandRepository extends JpaRepository<Command, Long> {

    /**
     * Get list of commands by device id
     *
     * @param deviceId the id of the device
     * @return List of Commands
     */
    @Query("SELECT c FROM Command c " +
            "JOIN c.model m " +
            "JOIN Device d ON d.model = m " +
            "WHERE d.id = :deviceId")
    List<Command> findAllByDeviceId(@Param("deviceId") Long deviceId);

}
