package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.IdNameDTO;
import com.capstonebau2025.centralhub.service.device.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<List<IdNameDTO>> getAllEventsByDeviceId(@PathVariable Long deviceId) {
        List<IdNameDTO> events = eventService.getAllByDeviceId(deviceId);
        return ResponseEntity.ok(events);
    }
}

