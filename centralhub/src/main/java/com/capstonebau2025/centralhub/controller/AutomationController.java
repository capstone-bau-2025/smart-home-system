package com.capstonebau2025.centralhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/automation")
public class AutomationController {

    private final AutomationService automationService;

    @Autowired
    public AutomationController(AutomationService automationService) {
        this.automationService = automationService;
    }

    // Create Automation Rule
    @PostMapping("/rule")
    public ResponseEntity<AutomationRule> createRule(@RequestBody AutomationRule rule) {
        return ResponseEntity.status(HttpStatus.CREATED).body(automationService.createAutomationRule(rule));
    }

    // Get Automation Rule by ID
    @GetMapping("/rule/{id}")
    public ResponseEntity<AutomationRule> getRuleById(@PathVariable Long id) {
        return ResponseEntity.ok(automationService.getAutomationRuleById(id));
    }

    // Update Automation Rule
    @PutMapping("/rule/{id}")
    public ResponseEntity<AutomationRule> updateRule(@PathVariable Long id, @RequestBody AutomationRule rule) {
        return ResponseEntity.ok(automationService.updateAutomationRule(id, rule));
    }

    // Trigger Automation Rule
    @PostMapping("/trigger")
    public ResponseEntity<Void> triggerAutomation(@RequestBody AutomationTrigger trigger) {
        automationService.triggerAutomation(trigger);
        return ResponseEntity.noContent().build();
    }
}

