package com.capstonebau2025.cloudserver.dto;

import lombok.Data;

@Data
public class UnlinkUserRequest {
    private String token;
    private String email;
}
