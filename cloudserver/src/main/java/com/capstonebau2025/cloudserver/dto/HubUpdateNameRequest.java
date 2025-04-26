package com.capstonebau2025.cloudserver.dto;

import lombok.Data;

@Data
public class HubUpdateNameRequest {
    private String token;
    private String name;
}