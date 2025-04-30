package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.service.device.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    // TODO: Implement the event controller methods or remove it
}

