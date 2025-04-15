package com.capstonebau2025.cloudserver.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InteractionDTO {
    private InteractionType type;
    private String name;
    private Long deviceId;
    private String category;

    // if it is info, range, or choice
    private Long stateValueId;
    private String value;

    // if it is a range
    private String min;
    private String max;

    // if it is a choice
    private String[] choices;

    // if it is a command
    private Long commandId;

    public enum InteractionType {
        INFO, RANGE, CHOICE, COMMAND
    }
}
