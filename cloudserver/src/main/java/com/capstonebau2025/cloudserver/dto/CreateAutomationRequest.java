package com.capstonebau2025.cloudserver.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CreateAutomationRequest {
    private String ruleName;
    private String ruleDescription;
    private String triggerType;
    private Integer cooldownDuration;

    // Trigger type: event
    private Long eventId;
    private Long deviceId;

    // Trigger type: status
    private Long stateValueId;
    private String stateTriggerValue;
    private String operator; // EQUAL, GREATER, LESS, GREATER_OR_EQUAL, LESS_OR_EQUAL

    // Trigger type: scheduled
    private String scheduledTime;

    private List<ActionDTO> actions;
}
