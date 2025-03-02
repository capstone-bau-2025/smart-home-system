package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.AutomationTrigger;
import com.capstonebau2025.centralhub.repository.AutomationTriggerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AutomationTriggerService extends GenericServiceImpl<AutomationTrigger, Long> {

    @Autowired
    public AutomationTriggerService(AutomationTriggerRepository automationTriggerRepository) {
        setRepository(automationTriggerRepository);
    }

    public AutomationTrigger create(AutomationTrigger automationTrigger) {
        return super.create(automationTrigger);
    }

    public AutomationTrigger update(AutomationTrigger automationTrigger) {
        return super.update(automationTrigger);
    }

    public Optional<AutomationTrigger> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<AutomationTrigger> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(AutomationTrigger automationTrigger) {
        super.delete(automationTrigger);
    }
}

