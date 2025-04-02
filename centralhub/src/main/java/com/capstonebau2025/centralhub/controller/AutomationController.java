package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.service.automation.AutomationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/automation")
@RequiredArgsConstructor
public class AutomationController {

    private final AutomationService automationService;

}

