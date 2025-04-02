package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.service.device.CommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/commands")
@RequiredArgsConstructor
public class CommandController {

    private final CommandService commandService;
}


