package com.capstonebau2025.cloudserver.dto;

import lombok.Data;

@Data
public class ExecuteCommandRequest {
    private Long deviceId;
    private Long commandId;
    private String email;
}
