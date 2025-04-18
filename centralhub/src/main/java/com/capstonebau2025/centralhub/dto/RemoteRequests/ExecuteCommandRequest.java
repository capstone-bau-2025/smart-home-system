package com.capstonebau2025.centralhub.dto.RemoteRequests;

import lombok.Data;

@Data
public class ExecuteCommandRequest {
    private Long deviceId;
    private Long commandId;
}