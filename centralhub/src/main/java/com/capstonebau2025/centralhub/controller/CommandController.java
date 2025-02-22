package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.entity.Command;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/commands")
public class CommandController {

    private final CommandService commandService;

    @Autowired
    public CommandController(CommandService commandService) {
        this.commandService = commandService;
    }

    // Execute Command
    @PostMapping
    public ResponseEntity<Command> executeCommand(@RequestBody Command command) {
        return ResponseEntity.ok(commandService.executeCommand(command));
    }

    // Get Command by ID
    @GetMapping("/{id}")
    public ResponseEntity<Command> getCommandById(@PathVariable Long id) {
        return ResponseEntity.ok(commandService.getCommandById(id));
    }
}



//not sure need changes

