package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.service.AreaService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.security.RolesAllowed;
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
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN, REMOTE")
    public ResponseEntity<Area> addArea(@RequestParam String areaName, @RequestParam Integer iconId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(areaService.addArea(areaName, iconId));
    }

    @GetMapping("/get-all")
    @Operation(summary = "REMOTE")
    public ResponseEntity<List<Area>> getAllAreas() {
        return ResponseEntity.ok(areaService.getAllAreas());
    }

    @DeleteMapping("/{areaId}")
    @RolesAllowed("ADMIN")
    @Operation(summary = "ADMIN, REMOTE")
    public ResponseEntity<Void> deleteArea(@PathVariable Long areaId) {
        areaService.deleteArea(areaId);
        return ResponseEntity.noContent().build();
    }
}

