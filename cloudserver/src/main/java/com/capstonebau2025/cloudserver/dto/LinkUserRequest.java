package com.capstonebau2025.cloudserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkUserRequest {
    private String token;
    private String hubSerialNumber;
}
