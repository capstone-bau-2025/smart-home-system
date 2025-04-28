package com.capstonebau2025.centralhub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AreaInteractionsDTO {
    private String areaName;
    private Integer iconId;
    private Long areaId;
    private InteractionDTO[] interactions;
}
