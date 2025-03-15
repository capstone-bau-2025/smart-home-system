package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.entity.Event;
import com.capstonebau2025.centralhub.service.crud.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events")
public class EventController {

    private EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Get Event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable long id) {
        return ResponseEntity.of(eventService.getById(id));
    }
}

