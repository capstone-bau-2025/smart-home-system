package com.capstonebau2025.centralhub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActionDTO {

    private String type;

    // only if ActionType is COMMAND -> LIST OF DEVICES -> LIST OF COMMANDS
    private Long deviceId;
    private Long commandId;

    // only if ActionType is STATE_UPDATE -> LIST OF DEVICES -> LIST OF STATES (MUTABLE), STATE ACTION VALUE
    private Long stateValueId;
    private String actionValue;

}
