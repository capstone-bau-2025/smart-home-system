package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.entity.Command;
import com.capstonebau2025.centralhub.service.crud.CommandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/commands")
public class CommandController {

    private final CommandService commandService;

    @Autowired
    public CommandController(CommandService commandService) {
        this.commandService = commandService;
    }

    // Execute Command this is only a dummy method
    @PostMapping
    public ResponseEntity<Command> executeCommand(@RequestBody Command command) {
        return ResponseEntity.ok(command);
    }

    // Get Command by ID
    @GetMapping("/{id}")
    public ResponseEntity<Command> getCommandById(@PathVariable Long id) {
        return ResponseEntity.of(commandService.getById(id));
    }
}


