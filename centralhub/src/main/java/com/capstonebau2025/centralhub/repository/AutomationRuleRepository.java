package com.capstonebau2025.centralhub.repository;

import com.capstonebau2025.centralhub.entity.AutomationRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutomationRuleRepository extends JpaRepository<AutomationRule, Long> {
    List<AutomationRule> findAllByIsEnabledTrue();
}
