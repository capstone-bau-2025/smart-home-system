package com.capstonebau2025.cloudserver.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AreaInteractionsDTO {
    private String areaName;
    private Long areaId;
    private InteractionDTO[] interactions;
} // TODO: not used as response of hub is returned directly as Object
