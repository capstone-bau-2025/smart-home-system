package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.AutomationTrigger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AutomationTriggerRepository extends JpaRepository<AutomationTrigger, Long> {
    Optional<AutomationTrigger> findByAutomationRuleId(Long automationRuleId);

    boolean existsByDeviceId(Long deviceId);
}
