package com.capstonebau2025.centralhub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommandDTO {
    private Long id;
    private String name;
}