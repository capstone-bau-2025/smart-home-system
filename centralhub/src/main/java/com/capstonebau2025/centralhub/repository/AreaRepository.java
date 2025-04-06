package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {

    Optional<Area> findByName(String name);

    default Area findGeneralArea() {

        Optional<Area> optionalGeneralArea = findByName("GENERAL");
        if (optionalGeneralArea.isPresent()) {
            return optionalGeneralArea.get();
        }
        else {
            Area generalArea = new Area();
            generalArea.setName("GENERAL");
            return save(generalArea);
        }
    }

    @Query("SELECT a FROM Area a WHERE a.id IN (SELECT p.area.id FROM Permission p WHERE p.user.id = :userId)")
    List<Area> findAreasByUserId(@Param("userId") Long userId);
}
