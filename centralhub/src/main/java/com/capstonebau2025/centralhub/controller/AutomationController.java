package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.CreateAutomationRuleDto;
import com.capstonebau2025.centralhub.dto.ToggleAutomationRuleDto;
import com.capstonebau2025.centralhub.entity.AutomationRule;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.service.automation.AutomationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/automations")
@RequiredArgsConstructor
public class AutomationController {
    private final AutomationService automationService;



    @DeleteMapping("/delete/{ruleId}")
    public ResponseEntity<String> deleteAutomation(@PathVariable Long ruleId) {
        String result = automationService.deleteAutomationRule(ruleId);
        return ResponseEntity.ok(result);
    }


    @PostMapping("/create")
    public ResponseEntity <AutomationRule> createAutomation (@RequestBody CreateAutomationRuleDto ruleDto,
                                                             @AuthenticationPrincipal User user) {
        AutomationRule rule =  automationService.createAutomation(ruleDto , user);
        return ResponseEntity.ok(rule);
    }


    @PostMapping("/toggle")
    public ResponseEntity <AutomationRule> toggleAutomation (@RequestBody ToggleAutomationRuleDto toggleAutomationDto) {
        AutomationRule rule =  automationService.toggleAutomation(toggleAutomationDto);
       return ResponseEntity.ok(rule);
    }

}

