package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.IdNameDTO;
import com.capstonebau2025.centralhub.service.device.CommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commands")
@RequiredArgsConstructor
public class CommandController {

    private final CommandService commandService;

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<List<IdNameDTO>> getAllCommandsByDeviceId(@PathVariable Long deviceId) {
        List<IdNameDTO> commands = commandService.getAllByDeviceId(deviceId);
        return ResponseEntity.ok(commands);
    }
}
