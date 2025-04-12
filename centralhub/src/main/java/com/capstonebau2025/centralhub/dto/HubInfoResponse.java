package com.capstonebau2025.centralhub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HubInfoResponse {
    private String serialNumber;
    private String name;
    private String location;
    private String status;
}
