package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.service.crud.AreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/areas")
public class AreaController {

    private final AreaService areaService;

    @Autowired
    public AreaController(AreaService areaService) {
        this.areaService = areaService;
    }

    // Create Area
    @PostMapping
    public ResponseEntity<Area> createArea(@RequestBody Area area) {
        return ResponseEntity.status(HttpStatus.CREATED).body(areaService.create(area));
    }

    // Get Area by ID
    @GetMapping("/{id}")
    public ResponseEntity<Area> getAreaById(@PathVariable Long id) {
        return ResponseEntity.of(areaService.getById(id));
    }

    // Update Area
    @PutMapping("/{id}")
    public ResponseEntity<Area> updateArea(@PathVariable Long id, @RequestBody Area area) {
        return ResponseEntity.ok(areaService.update(area));
    }

    // Delete Area
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArea(@PathVariable Long id) {
        areaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

