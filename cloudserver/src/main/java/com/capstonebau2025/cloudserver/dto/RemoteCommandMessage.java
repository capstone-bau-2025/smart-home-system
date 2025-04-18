package com.capstonebau2025.cloudserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RemoteCommandMessage {
    private String commandType;
    private String email;
    private Object payload;
    private String requestId;
}
