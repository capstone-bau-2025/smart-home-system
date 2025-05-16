package com.capstonebau2025.cloudserver.controller.remote;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.capstonebau2025.cloudserver.dto.RemoteCommandResponse;
import com.capstonebau2025.cloudserver.dto.CreateAutomationRequest;
import com.capstonebau2025.cloudserver.dto.ToggleAutomationRequest;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.HubAccessService;
import com.capstonebau2025.cloudserver.service.RemoteCommandProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/automations")
@RequiredArgsConstructor
@Slf4j
public class RemoteAutomationController {

    private final RemoteCommandProcessor commandProcessor;
    private final HubAccessService hubAccessService;

    @GetMapping
    public ResponseEntity<?> getAllAutomations(@RequestParam String hubSerialNumber) {
        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);

        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("GET_ALL_AUTOMATIONS")
                .email(user.getEmail())
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 10);

        return ResponseEntity.ok(response.getPayload());
    }

    @PostMapping
    public ResponseEntity<?> createAutomation(
            @RequestBody CreateAutomationRequest request,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);


        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("CREATE_AUTOMATION")
                .email(user.getEmail())
                .payload(request)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 10);

        return ResponseEntity.ok(response.getPayload());
    }

    @PatchMapping("/status")
    public ResponseEntity<?> toggleAutomation(
            @RequestBody ToggleAutomationRequest request,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);


        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("TOGGLE_AUTOMATION")
                .email(user.getEmail())
                .payload(request)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 10);

        return ResponseEntity.ok(response.getPayload());
    }

    @DeleteMapping("/{ruleId}")
    public ResponseEntity<?> deleteAutomation(
            @PathVariable Long ruleId,
            @RequestParam String hubSerialNumber) {

        User user = hubAccessService.validateUserHubAccess(hubSerialNumber);


        RemoteCommandMessage message = RemoteCommandMessage.builder()
                .commandType("DELETE_AUTOMATION")
                .email(user.getEmail())
                .payload(ruleId)
                .build();

        RemoteCommandResponse response = commandProcessor.processCommandAndWaitForResponse(
                hubSerialNumber, message, 10);

        return ResponseEntity.noContent().build();
    }
}
