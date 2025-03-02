package com.capstonebau2025.centralhub.service;


// StateService.java

import com.capstonebau2025.centralhub.entity.State;
import com.capstonebau2025.centralhub.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StateService extends GenericServiceImpl<State, Long> {

    @Autowired
    public StateService(StateRepository stateRepository) {
        setRepository(stateRepository);
    }

    public State create(State state) {
        return super.create(state);
    }

    public State update(State state) {
        return super.update(state);
    }

    public Optional<State> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<State> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(State state) {
        super.delete(state);
    }
}

