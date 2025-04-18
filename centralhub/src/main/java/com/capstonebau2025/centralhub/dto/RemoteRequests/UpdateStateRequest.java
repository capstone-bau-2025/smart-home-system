package com.capstonebau2025.centralhub.dto.RemoteRequests;

import lombok.Data;

@Data
public class UpdateStateRequest {
    private Long stateValueId;
    private String value;
}