package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.AutomationAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AutomationActionRepository extends JpaRepository<AutomationAction, Long> {
    List<AutomationAction> findByAutomationRuleId(Long ruleId);
}
