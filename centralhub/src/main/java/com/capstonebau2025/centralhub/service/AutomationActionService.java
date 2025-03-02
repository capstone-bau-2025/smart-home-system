package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.AutomationAction;
import com.capstonebau2025.centralhub.repository.AutomationActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AutomationActionService extends GenericServiceImpl<AutomationAction, Long> {

    @Autowired
    public AutomationActionService(AutomationActionRepository automationActionRepository) {
        setRepository(automationActionRepository);
    }

    public AutomationAction create(AutomationAction automationAction) {
        return super.create(automationAction);
    }

    public AutomationAction update(AutomationAction automationAction) {
        return super.update(automationAction);
    }

    public Optional<AutomationAction> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<AutomationAction> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(AutomationAction automationAction) {
        super.delete(automationAction);
    }
}
