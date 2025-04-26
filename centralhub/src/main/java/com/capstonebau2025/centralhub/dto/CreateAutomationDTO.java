package com.capstonebau2025.centralhub.dto;

import lombok.Data;

@Data
public class CreateAutomationDTO {
    private String ruleName;
    private String description;
    private String TriggerType; // SCHEDULE, EVENT, STATUS_VALUE
    private Integer cooldownDuration;

    // only if triggerType is SCHEDULE
    private String scheduledTime; // HH:mm:ss nullable

    private Long deviceId;

    // only if triggerType is EVENT
    private Long eventId;

    // only if triggerType is STATUS_VALUE
    private Long stateValueId;
    private String stateTriggerValue;
    private String operator; // EQUAL, GREATER, LESS, GREATER_OR_EQUAL, LESS_OR_EQUAL

    private List<ActionsDTO> actions;

    @Data
    class ActionsDTO {
        private Long actionDeviceId;
        private Long commandId;
    }
}

/*{
    "ruleName": "best rule",
    "description": "best description",
    ...,
    "actions": [
        {
            "actionDeviceId": 1,
            "commandId": 30
        },
        {
            "actionDeviceId": 1,
            "commandId": 30
        },
    ]
}*/
