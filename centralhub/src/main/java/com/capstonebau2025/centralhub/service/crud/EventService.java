package com.capstonebau2025.centralhub.service.crud;

// EventService.java

import com.capstonebau2025.centralhub.entity.Event;
import com.capstonebau2025.centralhub.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EventService extends GenericServiceImpl<Event, Long> {

    @Autowired
    public EventService(EventRepository eventRepository) {
        setRepository(eventRepository);
    }

    public Event create(Event event) {
        return super.create(event);
    }

    public Event update(Event event) {
        return super.update(event);
    }

    public Optional<Event> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<Event> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(Event event) {
        super.delete(event);
    }
}
