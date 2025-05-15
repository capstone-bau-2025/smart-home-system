package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.AutomationDTO;
import com.capstonebau2025.centralhub.dto.CreateAutomationRuleDTO;
import com.capstonebau2025.centralhub.dto.ToggleAutomationRuleDto;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.service.automation.AutomationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/automations")
@RequiredArgsConstructor
public class AutomationController {
    private final AutomationService automationService;

    @DeleteMapping("/delete/{ruleId}")
    public ResponseEntity<Void> deleteAutomation(@PathVariable Long ruleId) {
        automationService.deleteAutomationRule(ruleId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create")
    public ResponseEntity<AutomationDTO> createAutomation(@RequestBody CreateAutomationRuleDTO ruleDto,
                                                             @AuthenticationPrincipal User user) {
        AutomationDTO rule = automationService.createAutomation(ruleDto , user);
        return ResponseEntity.ok(rule);
    }

    @PostMapping("/toggle")
    public ResponseEntity<AutomationDTO> toggleAutomation(@RequestBody ToggleAutomationRuleDto toggleAutomationDto) {
        AutomationDTO rule = automationService.toggleAutomation(toggleAutomationDto);
       return ResponseEntity.ok(rule);
    }

    @GetMapping
    public ResponseEntity<List<AutomationDTO>> getAllAutomationRule () {
        List<AutomationDTO> automationRules = automationService.getAllAutomationRules();
        return ResponseEntity.ok(automationRules);
    }

}

