package com.capstonebau2025.centralhub.dto.RemoteRequests;


import com.capstonebau2025.centralhub.dto.ActionDTO;
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

    //attribute specific for trigger type event
    private Long eventId;
    private Long deviceId;

    //attribute specific for trigger type status
    private Long stateValueId;
    private String stateTriggerValue;

    //attribute specific for trigger type scheduled
    private String scheduledTime;

    private List<ActionDTO> actions;
}
