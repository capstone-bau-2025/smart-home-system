package com.capstonebau2025.centralhub.service.crud;

import com.capstonebau2025.centralhub.entity.AutomationRule;
import com.capstonebau2025.centralhub.repository.AutomationRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AutomationRuleService extends GenericServiceImpl<AutomationRule, Long> {

    @Autowired
    public AutomationRuleService(AutomationRuleRepository automationRuleRepository) {
        setRepository(automationRuleRepository);
    }

    public AutomationRule create(AutomationRule automationRule) {
        return super.create(automationRule);
    }

    public AutomationRule update(AutomationRule automationRule) {
        return super.update(automationRule);
    }

    public Optional<AutomationRule> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<AutomationRule> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(AutomationRule automationRule) {
        super.delete(automationRule);
    }
}

