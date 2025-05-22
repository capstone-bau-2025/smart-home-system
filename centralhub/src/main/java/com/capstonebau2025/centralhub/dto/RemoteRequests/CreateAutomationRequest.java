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
    private String triggerType; // EVENT, SCHEDULE, STATE_UPDATE
    private Integer cooldownDuration;

    //attribute specific for trigger type event -> LIST OF DEVICES -> LIST OF EVENTS
    private Long eventId;
    private Long deviceId;

    //attribute specific for trigger type status -> LIST OF DEVICES -> LIST OF STATES (IMMUTALBE), STATE TRIGGER VALUE
    private Long stateValueId;
    private String stateTriggerValue;
    private String operator; // EQUAL, GREATER, LESS, GREATER_OR_EQUAL, LESS_OR_EQUAL

    //attribute specific for trigger type scheduled
    private String scheduledTime; // "HH:MM"

    private List<ActionDTO> actions;
}
