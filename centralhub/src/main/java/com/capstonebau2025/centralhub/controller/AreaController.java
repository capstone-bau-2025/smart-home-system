package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.service.AreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService areaService;

    @PostMapping("/add")
    public ResponseEntity<Area> addArea(@RequestParam String areaName, @RequestParam Integer iconId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(areaService.addArea(areaName, iconId));
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<Area>> getAllAreas() {
        return ResponseEntity.ok(areaService.getAllAreas());
    }

    @DeleteMapping("/{areaId}")
    public ResponseEntity<Void> deleteArea(@PathVariable Long areaId) {
        areaService.deleteArea(areaId);
        return ResponseEntity.noContent().build();
    }
}

