package com.capstonebau2025.centralhub.service.crud;

// StateValueService.java

import com.capstonebau2025.centralhub.entity.StateValue;
import com.capstonebau2025.centralhub.repository.StateValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StateValueService extends GenericServiceImpl<StateValue, Long> {

    @Autowired
    public StateValueService(StateValueRepository stateValueRepository) {
        setRepository(stateValueRepository);
    }

    public StateValue create(StateValue stateValue) {
        return super.create(stateValue);
    }

    public StateValue update(StateValue stateValue) {
        return super.update(stateValue);
    }

    public Optional<StateValue> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<StateValue> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(StateValue stateValue) {
        super.delete(stateValue);
    }
}
