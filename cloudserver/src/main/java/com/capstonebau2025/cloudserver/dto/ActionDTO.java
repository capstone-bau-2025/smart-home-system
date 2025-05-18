package com.capstonebau2025.cloudserver.dto;


import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class ActionDTO {

    private Long deviceId;
    private Long commandId;
    private Long stateValueId;
    private String type;
    private String actionValue;

}