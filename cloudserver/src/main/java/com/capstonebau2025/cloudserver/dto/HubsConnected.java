package com.capstonebau2025.cloudserver.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HubsConnected {
    private String serialNumber;
    private String name;
    private String role;
}