package com.capstonebau2025.cloudserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private String timestamp;  // Changed from LocalDateTime to String
    private int status;
    private String error;
    private String message;
    private String path;
}