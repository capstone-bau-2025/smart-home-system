package com.capstonebau2025.centralhub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InteractionAreaDTO {
    private String areaName;
    private Long areaId;
    private InteractionDTO[] interactions;
}
