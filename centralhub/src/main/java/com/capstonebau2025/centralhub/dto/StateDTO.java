package com.capstonebau2025.centralhub.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StateDTO {
    private Long id;
    private String name;
    private String type;

    private Integer maxRange;
    private Integer minRange;

    private List<String> choices;
}
