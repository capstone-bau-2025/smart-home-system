package com.capstonebau2025.centralhub.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateAutomationRuleDTO {

    private String ruleName;
    private String ruleDescription;
    private String triggerType;
    private Integer cooldownDuration;

    //attribute speciffic for trigger type event
    private Long eventId;
    private Long deviceId;

    //attribute speciffic for trigger type status
    private Long statusValueId;

    //attribute speciffic for trigger type scheduled
    private String scheduledTime;



    // TODO: include actions details
}
