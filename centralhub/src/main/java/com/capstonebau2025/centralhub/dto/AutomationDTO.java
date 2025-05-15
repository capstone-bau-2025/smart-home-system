package com.capstonebau2025.centralhub.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class AutomationDTO {

    private Long id;
    private String ruleName;
    private String ruleDescription;
    private String triggerType;
    private Integer cooldownDuration;
    private Boolean isEnabled;

    //attribute speciffic for trigger type event
    private Long eventId;
    private Long deviceId;

    //attribute speciffic for trigger type status
    private Long statusValueId;

    //attribute speciffic for trigger type scheduled
    private String scheduledTime;

    private List<ActionDTO> actions;
}
