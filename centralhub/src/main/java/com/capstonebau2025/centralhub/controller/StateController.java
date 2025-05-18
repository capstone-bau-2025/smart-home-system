package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.StateDTO;
import com.capstonebau2025.centralhub.service.device.StateService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/states")
@RequiredArgsConstructor
public class StateController {

    private final StateService stateService;

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<List<StateDTO>> getStatesByDeviceId(
            @PathVariable Long deviceId,
            @Parameter(description = "Filter type: 'ALL' (default), 'MUTABLE', or 'IMMUTABLE'")
            @RequestParam(required = false, defaultValue = "ALL") String filter) {
        List<StateDTO> states = stateService.getStatesByFilterAndDeviceId(deviceId, filter);
        return ResponseEntity.ok(states);
    }
}
