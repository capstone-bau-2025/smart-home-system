package com.capstonebau2025.centralhub.dto;


import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Data
@Builder
public class CreateAutomationRuleDto {
    private String ruleName;
    private String ruleDescription;
    private Boolean isEnabled; // TODO: no need for this, enable by default
    private String triggerType;
    private String scheduledTime;
    private Long eventId;
    private Long statusValueId;
    private Integer cooldownDuration;

    // TODO: get device id too

    // TODO: include actions details
}
