package com.capstonebau2025.centralhub.controller;

import com.capstonebau2025.centralhub.dto.AutomationDTO;
import com.capstonebau2025.centralhub.dto.RemoteRequests.CreateAutomationRequest;
import com.capstonebau2025.centralhub.dto.RemoteRequests.ToggleAutomationRequest;
import com.capstonebau2025.centralhub.entity.User;
import com.capstonebau2025.centralhub.service.automation.AutomationService;
import io.swagger.v3.oas.annotations.Operation;
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

    @DeleteMapping("/{ruleId}")
    @Operation(summary = "REMOTE")
    public ResponseEntity<Void> deleteAutomation(@PathVariable Long ruleId) {
        automationService.deleteAutomation(ruleId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping()
    @Operation(summary = "REMOTE")
    public ResponseEntity<AutomationDTO> createAutomation(@RequestBody CreateAutomationRequest request,
                                                             @AuthenticationPrincipal User user) {
        AutomationDTO automationDTO = automationService.createAutomation(request , user);
        return ResponseEntity.ok(automationDTO);
    }

    @PatchMapping("/status")
    @Operation(summary = "REMOTE")
    public ResponseEntity<AutomationDTO> toggleAutomation(@RequestBody ToggleAutomationRequest request) {
        AutomationDTO automationDTO = automationService.toggleAutomation(request);
       return ResponseEntity.ok(automationDTO);
    }

    @GetMapping
    @Operation(summary = "REMOTE")
    public ResponseEntity<List<AutomationDTO>> getAllAutomationRule () {
        List<AutomationDTO> automationDTOs = automationService.getAllAutomations();
        return ResponseEntity.ok(automationDTOs);
    }

}

