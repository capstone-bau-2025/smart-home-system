package com.capstonebau2025.centralhub.service.crud;

import com.capstonebau2025.centralhub.entity.Command;
import com.capstonebau2025.centralhub.repository.CommandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CommandService extends GenericServiceImpl<Command, Long> {

    @Autowired
    public CommandService(CommandRepository commandRepository) {
        setRepository(commandRepository);
    }

    public Command create(Command command) {
        return super.create(command);
    }

    public Command update(Command command) {
        return super.update(command);
    }

    public Optional<Command> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<Command> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(Command command) {
        super.delete(command);
    }
}

