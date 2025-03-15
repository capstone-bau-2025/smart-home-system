package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.entity.AutomationRule;
import com.capstonebau2025.centralhub.entity.AutomationTrigger;
import com.capstonebau2025.centralhub.service.crud.AutomationActionService;
import com.capstonebau2025.centralhub.service.crud.AutomationRuleService;
import com.capstonebau2025.centralhub.service.crud.AutomationTriggerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/automation")
public class AutomationController {

    private final AutomationActionService automationActionServiceService;
    private final AutomationRuleService automationRuleService;
    private final AutomationTriggerService automationTriggerService;


    @Autowired
    public AutomationController(AutomationActionService automationActionService ,
                                AutomationRuleService automationRuleService ,
                                AutomationTriggerService automationTriggerService) {
        this.automationActionServiceService = automationActionService;
        this.automationRuleService = automationRuleService;
        this.automationTriggerService = automationTriggerService;
    }

    // Create Automation Rule
    @PostMapping("/rule")
    public ResponseEntity<AutomationRule> createRule(@RequestBody AutomationRule rule) {
        return ResponseEntity.status(HttpStatus.CREATED).body(automationRuleService.create(rule));
    }

    //add get all rules

    // Get Automation Rule by ID
    @GetMapping("/rule/{id}")
    public ResponseEntity<AutomationRule> getRuleById(@PathVariable Long id) {
        return ResponseEntity.of(automationRuleService.getById(id));
    }

    // Update Automation Rule
    @PutMapping("/rule/{id}")
    public ResponseEntity<AutomationRule> updateRule(@PathVariable Long id, @RequestBody AutomationRule rule) {
        return ResponseEntity.ok(automationRuleService.update(rule));
    }

    // Trigger Automation Rule
    @PostMapping("/trigger")
    public ResponseEntity<Void> triggerAutomation(@RequestBody AutomationTrigger trigger) {
        automationTriggerService.update(trigger);
        return ResponseEntity.noContent().build();
    }
}

