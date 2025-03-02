package com.capstonebau2025.centralhub.service;

// StateChoiceService.java

import com.capstonebau2025.centralhub.entity.StateChoice;
import com.capstonebau2025.centralhub.repository.StateChoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StateChoiceService extends GenericServiceImpl<StateChoice, Long> {

    @Autowired
    public StateChoiceService(StateChoiceRepository stateChoiceRepository) {
        setRepository(stateChoiceRepository);
    }

    public StateChoice create(StateChoice stateChoice) {
        return super.create(stateChoice);
    }

    public StateChoice update(StateChoice stateChoice) {
        return super.update(stateChoice);
    }

    public Optional<StateChoice> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<StateChoice> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(StateChoice stateChoice) {
        super.delete(stateChoice);
    }
}
