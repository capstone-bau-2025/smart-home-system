package com.capstonebau2025.centralhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RemoteCommandResponse {
    private String commandType;
    private String status; // SUCCESS, ERROR
    private String message;
    private Object payload; // For returning data (can be any type)
    private String requestId; // To correlate request and response
}
